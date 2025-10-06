"use client";

import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import useValidtateWorkerReCount from "../../_hooks/useValidateWorkerReCount";
import { ChevronDown } from "lucide-react";
import { WorkerTask, WorkerTaskStatus } from "@/types/workerTask";
import ValidateReCountButton from "./ValidateReCountButton";

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
  workerTask: WorkerTask;
}

export default function WorkerReCountForm({
  workerTask,
}: WorkerReCountFormProps) {
  const validateWorkerReCount = useValidtateWorkerReCount();

  const initialValues = {
    workerTaskId: workerTask.id,
    items:
      workerTask.orderHeader?.OrderItem?.flatMap((orderItem) =>
        (orderItem.orderItemLaundry ?? []).map((laundry) => ({
          laundryItemId: laundry.laundryItem?.id ?? "",
          expectedQty: laundry.qty,
          qty: 0,
        }))
      ) || [],
  };

  const laundryNames =
    workerTask.orderHeader?.OrderItem?.flatMap((oi) =>
      oi.orderItemLaundry?.map((laundry) => laundry.laundryItem?.name ?? "")
    ) || [];

  return (
    <div className='collapse w-full'>
      <input type='checkbox' />
      <div className='collapse-title font-semibold flex justify-between gap-2 px-0'>
        <div>Re-count Laundry Items</div>
        <ChevronDown />
      </div>
      <div className='collapse-content text-sm p-0'>
        <div className='flex flex-col gap-2 w-full'>
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
            {({ values, setFieldValue, handleSubmit }) => (
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
                          workerTask.employee === null ||
                          workerTask.isBypassRequired && workerTask.isReqAprooved === null ||
                          workerTask.isItemValidated ||
                          workerTask.status === WorkerTaskStatus.IN_PROGRESS ||
                          workerTask.status === WorkerTaskStatus.DONE
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
                <ValidateReCountButton
                  workerTask={workerTask}
                  isPending={validateWorkerReCount.isPending}
                  onProcess={handleSubmit}
                />
              </Form>
            )}
          </Formik>
          <div className='flex justify-between gap-2'>
              <div>Re-count Status : </div>
              <div
                className={
                  workerTask.isItemValidated
                    ? "text-green-700 font-semibold"
                    : workerTask.isBypassRequired
                    ? "text-red-500 font-semibold"
                    : ""
                }
              >
                {workerTask.isItemValidated
                  ? "Item validated"
                  : workerTask.isBypassRequired
                  ? "Item mismatch!"
                  : "Not yet validated"}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
