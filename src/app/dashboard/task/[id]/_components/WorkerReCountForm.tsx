"use client";

import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useValidtateWorkerReCount from "../../_hooks/useValidateWorkerReCount";
import { ChevronDown } from "lucide-react";
import { Employee } from "@/types/employee";
import { WorkerTaskStatus } from "@/types/workerTask";

const ValidateWorkerReCountSchema = Yup.object().shape({
  workerTaskId: Yup.string().required("Worker task ID is required"),
  items: Yup.array()
    .of(
      Yup.object().shape({
        laundryItemId: Yup.string().required(),
        expectedQty: Yup.number().required(),
        qty: Yup.number()
          .transform((value, originalValue) =>
            originalValue === "" ? 0 : Number(originalValue)
          )
          .required("Quantity is required")
          .min(0, "Quantity must be at least 0"),
      })
    )
    .required("Items are required")
    .min(1, "At least one item is required"),
});

interface WorkerReCountFormProps {
  initialValues: {
    workerTaskId: string;
    items: { laundryItemId: string; expectedQty: number; qty: number }[];
  };
  laundryNames: (string | undefined)[];
  isTakenByWorker: Employee | undefined;
  workerTaskStatus: WorkerTaskStatus;
}

export default function WorkerReCountForm({
  initialValues,
  laundryNames,
  isTakenByWorker,
  workerTaskStatus,
}: WorkerReCountFormProps) {
  const validateWorkerReCount = useValidtateWorkerReCount();

  return (
    <div className='collapse w-full'>
      <input type='checkbox' />
      <div className='collapse-title font-semibold flex justify-between gap-2 px-0'>
        <div>Re-count Laundry Items</div>
        <ChevronDown />
      </div>
      <div className='collapse-content text-sm p-0'>
        <div className='w-full'>
          <Formik
            initialValues={initialValues}
            validationSchema={ValidateWorkerReCountSchema}
            validateOnChange
            validateOnBlur
            onSubmit={(values) => {
              const castedValues = ValidateWorkerReCountSchema.cast(values, {
                stripUnknown: true,
              });
              validateWorkerReCount.mutate(castedValues);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className='flex flex-col gap-4'>
                {values.items.map((item, index) => (
                  <div key={index} className='flex flex-col gap-2'>
                    <div className='relative flex items-center w-full px-1'>
                      <Field
                        as={Input}
                        name={`items.${index}.qty`}
                        type='text'
                        inputMode='numeric'
                        pattern='\d*'
                        maxLength={9}
                        autoComplete='off'
                        autoCorrect='off'
                        spellCheck={false}
                        disabled={
                          isTakenByWorker === null ||
                          workerTaskStatus === WorkerTaskStatus.IN_PROGRESS ||
                          workerTaskStatus === WorkerTaskStatus.DONE
                        }
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
                          e.target.select()
                        }
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setFieldValue(
                            `items.${index}.qty`,
                            value === "" ? "" : value
                          );
                        }}
                        placeholder='0'
                        className='input validator text-right border-0 border-b rounded-none border-gray-300 shadow-none
                                      disabled:bg-white disabled:text-black disabled:opacity-100'
                      />
                      <span className='absolute inset-y-0 left-3 flex items-center text-gray-500 pointer-events-none'>
                        {laundryNames[index]}
                      </span>
                    </div>
                    <ErrorMessage
                      name={`items.${index}.qty`}
                      component='div'
                      className='text-red-500 text-sm ml-2'
                    />
                  </div>
                ))}

                <Button
                  type='submit'
                  disabled={
                    validateWorkerReCount.isPending ||
                    isTakenByWorker === null ||
                    workerTaskStatus === WorkerTaskStatus.IN_PROGRESS ||
                    workerTaskStatus === WorkerTaskStatus.DONE
                  }
                  variant={"outline"}
                  className='w-full border-primary'
                >
                  {validateWorkerReCount.isPending
                    ? "Validating..."
                    : isTakenByWorker === null
                    ? "Process this task before validate"
                    : workerTaskStatus === WorkerTaskStatus.IN_PROGRESS
                    ? "Already validated"
                    : workerTaskStatus === WorkerTaskStatus.DONE
                    ? "Already validated"
                    : "Validate Items"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
