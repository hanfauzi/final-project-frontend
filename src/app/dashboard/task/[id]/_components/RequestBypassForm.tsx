"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useReqWorkerTaskBypass from "../../_hooks/useReqWorkerTaskBypass";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkerTask, WorkerTaskStatus } from "@/types/workerTask";

interface Props {
  workerTask: WorkerTask;
  workerTaskId: string;
}

const RequestBypassForm = ({ workerTask, workerTaskId }: Props) => {
  const reqBypass = useReqWorkerTaskBypass();

  return (
    <div className='flex flex-col gap-1'>
      <div className='collapse w-full'>
        <input type='checkbox' />
        <div className='collapse-title font-semibold flex justify-between gap-2 px-0'>
          <div>Request Bypass</div>
          <ChevronDown />
        </div>
        <div className='collapse-content text-sm p-0'>
          <div className='flex flex-col gap-2'>
            <Formik
              initialValues={{ bypassReqNote: "" }}
              validateOnBlur={false}
              validationSchema={Yup.object({
                bypassReqNote: Yup.string()
                  .required("Bypass note is required")
                  .min(5, "Note must be at least 5 characters"),
              })}
              onSubmit={(values, { resetForm }) => {
                reqBypass.mutate(
                  { workerTaskId, bypassReqNote: values.bypassReqNote },
                  {
                    onSuccess: () => {
                      resetForm();
                    },
                  }
                );
              }}
            >
              {({ isSubmitting }) => (
                <Form className='flex flex-col gap-2 px-[2px]'>
                  <Field
                    id='bypassReqNote'
                    name='bypassReqNote'
                    as='textarea'
                    disabled={
                      !workerTask.isBypassRequired ||
                      workerTask.bypassReq ||
                      workerTask.status === WorkerTaskStatus.DONE
                    }
                    placeholder={
                      workerTask.bypassReqNote || "Enter reason for bypass..."
                    }
                    className='border rounded-lg p-2 text-sm w-full'
                  />
                  <ErrorMessage
                    name='bypassReqNote'
                    component='div'
                    className='text-red-500 text-sm'
                  />

                  <Button
                    type='submit'
                    variant={"outline"}
                    className='w-full border-destructive'
                    disabled={
                      isSubmitting ||
                      reqBypass.isPending ||
                      !workerTask.isBypassRequired ||
                      workerTask.bypassReq ||
                      workerTask.status === WorkerTaskStatus.DONE
                    }
                  >
                    {reqBypass.isPending
                      ? "Submitting..."
                      : !workerTask.isBypassRequired
                      ? "This task does not require a bypass"
                      : workerTask.bypassReq
                      ? "Bypass already requested"
                      : "Request Bypass"}
                  </Button>
                </Form>
              )}
            </Formik>
            <div className='flex justify-between gap-2'>
              <div>Bypass Status : </div>
              <div
                className={
                  workerTask.isReqAprooved
                    ? "text-green-700 font-semibold"
                    : workerTask.bypassReq
                    ? "text-yellow-500 font-semibold"
                    : ""
                }
              >
                {workerTask.isReqAprooved
                  ? "Approved"
                  : workerTask.bypassReq
                  ? "Waiting for approval"
                  : "Not requested"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBypassForm;
