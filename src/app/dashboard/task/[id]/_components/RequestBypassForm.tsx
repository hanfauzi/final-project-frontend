"use client";

import { Textarea } from "@/components/ui/textarea";
import { WorkerTask, WorkerTaskStatus } from "@/types/workerTask";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ChevronDown } from "lucide-react";
import * as Yup from "yup";
import useReqWorkerTaskBypass from "../../_hooks/useReqWorkerTaskBypass";
import RequestBypassButton from "./RequestBypassButton";

interface Props {
  workerTask: WorkerTask;
}

const RequestBypassForm = ({ workerTask }: Props) => {
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
                  { workerTaskId: workerTask.id, bypassReqNote: values.bypassReqNote },
                  {
                    onSuccess: () => {
                      resetForm();
                    },
                  }
                );
              }}
            >
              {({ handleSubmit }) => (
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

                  <RequestBypassButton
                    workerTask={workerTask}
                    isPending={reqBypass.isPending}
                    onProcess={handleSubmit}
                  />

                </Form>
              )}
            </Formik>
            <div className='flex justify-between gap-2'>
              <div>Bypass Status : </div>
              <div
                className={
                  workerTask.isReqAprooved
                    ? "text-green-700 font-semibold"
                    : workerTask.isReqAprooved === false
                    ? "text-red-500 font-semibold"
                    : workerTask.bypassReq
                    ? "text-yellow-500 font-semibold"
                    : ""
                }
              >
                {workerTask.isReqAprooved === true
                  ? "Approved"
                  : workerTask.isReqAprooved === false
                  ? "Rejected"
                  : workerTask.bypassReq
                  ? "Waiting for approval"
                  : "Not requested"}
              </div>
            </div>
            {workerTask.itemPassedNote && (
              <div className='relative flex flex-col px-1'>
                <div className="top-2 left-4 absolute font-semibold">Admin Note : </div>
                <Textarea
                    readOnly
                    placeholder={
                      workerTask.itemPassedNote || ""
                    }
                    onFocus={(e) => e.target.blur()}
                    className='rounded-lg pt-8 text-sm w-full cursor-default'
                  />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestBypassForm;
