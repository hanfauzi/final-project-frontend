"use client";

import { FC } from "react";
import { useFormik, FieldArray, FormikProvider, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createOrderSchema } from "@/features/outlet-admin/order/schema/createOrderSchema";
import { useCreateOrderFromPickup } from "../_hooks/useOrdersOutletAdmin";
import { useLaundryItems } from "@/app/admin/_hooks/useLaundryItems";
import { useLaundryServices } from "@/app/admin/_hooks/useLaundryService";
import { Trash } from "lucide-react";

interface Props {
  pickupOrderId: string;
}

const CreateOrderForm: FC<Props> = ({ pickupOrderId }) => {
  const mutation = useCreateOrderFromPickup();

  // ambil data dari hooks
  const { data: services = [] } = useLaundryServices();
  const { data: laundryItems = [] } = useLaundryItems();

  const formik = useFormik({
    initialValues: {
      pickupOrderId,
      notes: "",
      items: [
        {
          serviceId: "",
          qty: 1,
          unitPrice: undefined,
          note: "",
          laundryItems: [{ laundryItemId: "", qty: 1 }],
        },
      ],
    },
    validationSchema: createOrderSchema,
    onSubmit: (values) => {
      console.log("SUBMIT!", values);
      mutation.mutate(values);
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create Order From Pickup</CardTitle>
      </CardHeader>
      <CardContent>
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <FieldArray name="items">
              {({ remove, push }) => (
                <div className="space-y-8">
                  {formik.values.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="border rounded-xl p-6 bg-gray-50 space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg">
                          Order Item {itemIndex + 1}
                        </h4>
                        <Button
                          className="cursor-pointer"
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(itemIndex)}
                        >
                          Remove Order Item
                        </Button>
                      </div>

                      {/* Service & Qty */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Service
                          </label>
                          <Select
                            value={item.serviceId}
                            onValueChange={(val) =>
                              formik.setFieldValue(
                                `items[${itemIndex}].serviceId`,
                                val
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Service" />
                            </SelectTrigger>
                            <SelectContent>
                              {services.map((service: any) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name={`items[${itemIndex}].serviceId`}
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Quantity
                          </label>
                          <Input
                            type="number"
                            name={`items[${itemIndex}].qty`}
                            value={item.qty}
                            onChange={formik.handleChange}
                          />
                          <ErrorMessage
                            name={`items[${itemIndex}].qty`}
                            component="p"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      </div>

                      {/* Unit Price & Note */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Unit Price
                          </label>
                          <Input
                            type="number"
                            name={`items[${itemIndex}].unitPrice`}
                            value={item.unitPrice || ""}
                            onChange={formik.handleChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Note
                          </label>
                          <Input
                            name={`items[${itemIndex}].note`}
                            value={item.note}
                            onChange={formik.handleChange}
                          />
                        </div>
                      </div>

                      {/* Laundry Items */}
                      <FieldArray name={`items[${itemIndex}].laundryItems`}>
                        {({ remove: removeLaundry, push: pushLaundry }) => (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium text-md">
                                Laundry Items
                              </h5>
                              <Button
                                className="cursor-pointer"
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() =>
                                  pushLaundry({ laundryItemId: "", qty: 1 })
                                }
                              >
                                + Add Laundry Item
                              </Button>
                            </div>

                            {item.laundryItems.map((li, liIndex) => (
                              <div
                                key={liIndex}
                                className="border rounded-md p-4 bg-white grid md:grid-cols-2 gap-4 items-end"
                              >
                                <div>
                                  <label className="block text-sm font-medium mb-1">
                                    Laundry Item
                                  </label>
                                  <Select
                                    value={li.laundryItemId}
                                    onValueChange={(val) =>
                                      formik.setFieldValue(
                                        `items[${itemIndex}].laundryItems[${liIndex}].laundryItemId`,
                                        val
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select Item" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {laundryItems.map((laundry: any) => (
                                        <SelectItem
                                          key={laundry.id}
                                          value={laundry.id}
                                        >
                                          {laundry.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="flex gap-2 items-end">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium mb-1">
                                      Qty
                                    </label>
                                    <Input
                                      type="number"
                                      name={`items[${itemIndex}].laundryItems[${liIndex}].qty`}
                                      value={li.qty}
                                      onChange={formik.handleChange}
                                    />
                                  </div>
                                  <Button
                                    className="cursor-pointer"
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeLaundry(liIndex)}
                                  >
                                    <Trash />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  ))}

                  <Button
                    className="cursor-pointer"
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      push({
                        serviceId: "",
                        qty: 1,
                        unitPrice: undefined,
                        note: "",
                        laundryItems: [{ laundryItemId: "", qty: 1 }],
                      })
                    }
                  >
                    + Add Order Item
                  </Button>
                </div>
              )}
            </FieldArray>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create Order"}
            </Button>
          </form>
        </FormikProvider>
      </CardContent>
    </Card>
  );
};

export default CreateOrderForm;
