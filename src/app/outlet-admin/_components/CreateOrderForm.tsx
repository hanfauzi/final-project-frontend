"use client";

import { FC, useEffect, useState } from "react";
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
import { usePickupOrders } from "../_hooks/usePickupOrders";

interface LaundryItemForm {
  laundryItemId: string;
  qty: number;
}

interface OrderItemForm {
  serviceId: string;
  service?: {
    id: string;
    name: string;
    basePrice: number;
    estHours?: number;
  };
  qty: number;
  unitPrice?: number;
  note?: string;
  laundryItems: LaundryItemForm[];
}

interface CreateOrderFormValues {
  pickupOrderId: string;
  notes: string;
  items: OrderItemForm[];
}

interface Props {
  pickupOrderId: string;
}

const CreateOrderForm: FC<Props> = ({ pickupOrderId }) => {
  const mutation = useCreateOrderFromPickup();
  const { data: laundryItems = [] } = useLaundryItems();
  const { data: pickupOrders = [] } = usePickupOrders();

  const [initialItems, setInitialItems] = useState<OrderItemForm[]>([]);

  useEffect(() => {
    const pickup = pickupOrders.find((p) => p.id === pickupOrderId);
    if (!pickup) return;

    // populate items dari pickup.services
    const itemsFromPickup: OrderItemForm[] = pickup.services.map(
      (service) => ({
        serviceId: service.id,
        service: service,
        qty: 1,
        unitPrice: service.basePrice ,
        note: "",
        laundryItems: [{ laundryItemId: "", qty: 1 }],
      })
    );
    setInitialItems(itemsFromPickup);
  }, [pickupOrderId, pickupOrders]);

  const formik = useFormik<CreateOrderFormValues>({
    initialValues: {
      pickupOrderId,
      notes: "",
      items: initialItems,
    },
    enableReinitialize: true, // biar initialValues update saat setInitialItems
    validationSchema: createOrderSchema,
    onSubmit: (values) => mutation.mutate(values),
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
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(itemIndex)}
                        >
                          Remove
                        </Button>
                      </div>

                      {/* Service & Qty */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Service
                          </label>
                          <Input value={item.service?.name} disabled />
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
                            disabled
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
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeLaundry(liIndex)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                            <Button
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
                        )}
                      </FieldArray>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            <Button
              type="submit"
              className="w-full"
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
