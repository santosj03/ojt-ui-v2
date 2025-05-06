import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import Heading from '@/components/shared/heading';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

const studentFormSchema = z.object({
  firstname: z.string().min(1, { message: 'First name is required' }),
  lastname: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
  class_section: z.string().min(1, { message: 'Class section is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  designation: z.string().min(1, { message: 'Designation is required' })
});

type StudentFormSchemaType = z.infer<typeof studentFormSchema>;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const StudentCreateModal = ({ modalClose }: { modalClose: () => void }) => {
  const [step, setStep] = useState<'capture' | 'form'>('capture');
  // const webcamRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);

  const form = useForm<StudentFormSchemaType>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {}
  });

  const onSubmit = async (formData: StudentFormSchemaType) => {
    if (!faceDescriptor) {
      alert('Please capture a face before submitting.');
      return;
    }

    const payload = {
      ...formData,
      descriptor: faceDescriptor
    };
    const token = localStorage.getItem('token');

    try {
      await axios.post(`${apiBaseUrl}/student/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Student saved!');
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Error saving student. Please try again.');
    }
  };

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  // Face registration handler
  const handleRegisterFace = async () => {
    const webcam = webcamRef.current;
    const video = webcam?.video;
    if (video && video.readyState === 4) {
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setFaceDescriptor(Array.from(detection.descriptor)); // convert Float32Array to number[]
        setStep('form'); // Proceed to the form step
      } else {
        alert('No face detected. Try again.');
      }
    }
  };

  return (
    <div className="px-2">
      {step === 'capture' && (
        <div className="flex flex-col items-center">
          <Heading
            title="Capture Student Face"
            description="Position face in frame and register"
            className="text-center"
          />
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              style={{ width: 640, height: 480 }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 640,
                height: 480
              }}
            />
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={modalClose}>
              Cancel
            </Button>
            <Button onClick={handleRegisterFace} disabled={!modelsLoaded}>
              Register Face
            </Button>
          </div>
        </div>
      )}

      {step === 'form' && (
        <>
          <Heading
            title={'Create New Student'}
            description={''}
            className="space-y-2 py-4 text-center"
          />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              autoComplete="off"
            >
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  'firstname',
                  'lastname',
                  'email',
                  'class_section',
                  'gender',
                  'designation'
                ].map((fieldName) => (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName as keyof StudentFormSchemaType}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={`Enter your ${fieldName.replace('_', ' ')}`}
                            {...field}
                            className="px-4 py-6 shadow-inner drop-shadow-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-full"
                  size="lg"
                  onClick={modalClose}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full" size="lg">
                  Create Student
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default StudentCreateModal;
