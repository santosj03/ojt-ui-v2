import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useCheckAttendance, useLogStudent } from '../students/queries/queries';
import { useSearchParams } from 'react-router-dom';

const FaceMatcherSingle = () => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceMatcher, setFaceMatcher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultTxt, setDefaultTxt] = useState('Loading student data...');
  const [hasLogged, setHasLogged] = useState(false); // Prevent duplicate log
  const [stopScanning, setStopScanning] = useState(false); // Flag to stop scanning

  interface AttendanceData {
    id: number;
    refno: string;
    student: { firstname: string; descriptor: number[] };
  }
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );

  const [searchParams] = useSearchParams();
  const refno = searchParams.get('refno') || null;
  const attendance = useCheckAttendance(refno);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ]);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const fetchStudentDescriptor = async () => {
      if (attendance.isError) {
        setDefaultTxt('No record found or this QR code is already logged!');
        return;
      }
      const result = attendance?.data.data;
      const descriptor = new Float32Array(result.student.descriptor);
      const labeledDescriptor = new faceapi.LabeledFaceDescriptors(
        result.student.firstname,
        [descriptor]
      );

      setFaceMatcher(new faceapi.FaceMatcher([labeledDescriptor], 0.6));
      setAttendanceData(result);
      setLoading(false);
    };

    if (modelsLoaded) fetchStudentDescriptor();
  }, [modelsLoaded]);

  const logStudent = useLogStudent({
    onSuccess: () => {
      alert('🎉 Student logged successfully!');
      setHasLogged(true); // Mark that the student has been logged
    },
    onError: () => {
      alert('❌ Failed to log student.');
    }
  });

  // Face matching loop
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (modelsLoaded && faceMatcher && !hasLogged && !stopScanning) {
      intervalId = setInterval(async () => {
        if (webcamRef.current?.video?.readyState === 4) {
          const video = webcamRef.current.video;
          const detection = await faceapi
            .detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            const match = faceMatcher.findBestMatch(detection.descriptor);
            if (match.label !== 'unknown' && match.distance <= 0.4) {
              console.log('✅ Match:', match.label);
              if (attendanceData?.id && !hasLogged) {
                logStudent.mutate(attendanceData.id);
                setHasLogged(true); // Mark that the student has been logged
                setStopScanning(true); // Stop scanning after match
              }
            } else {
              console.log('❌ No match found');
            }
          }
        }
      }, 1000); // Try every second
    }

    return () => clearInterval(intervalId);
  }, [
    modelsLoaded,
    faceMatcher,
    attendanceData,
    hasLogged,
    stopScanning,
    logStudent
  ]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      {loading ? (
        <p>{defaultTxt}</p>
      ) : (
        <>
          <h2>Verify Student</h2>
          <Webcam
            ref={webcamRef}
            audio={false}
            style={{ width: 640, height: 480 }}
          />
          <p style={{ marginTop: 10 }}>
            {hasLogged
              ? '✅ Face matched and logged!'
              : '🔍 Scanning for face...'}
          </p>
        </>
      )}
    </div>
  );
};

export default FaceMatcherSingle;
