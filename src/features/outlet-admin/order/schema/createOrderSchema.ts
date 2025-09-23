import * as Yup from "yup";

export const createOrderSchema = Yup.object().shape({
  pickupOrderId: Yup.string().optional(),
  notes: Yup.string().optional(),
  items: Yup.array()
    .of(
      Yup.object().shape({
        serviceId: Yup.string().required("Service wajib diisi"),
        qty: Yup.number().min(1, "Minimal 1").required("Qty wajib diisi"),
        unitPrice: Yup.number().optional(),
        note: Yup.string().optional(),
        laundryItems: Yup.array().of(
          Yup.object().shape({
            laundryItemId: Yup.string().required("LaundryItem wajib diisi"),
            qty: Yup.number().min(1, "Minimal 1").required("Qty wajib diisi"),
          })
        ),
      })
    )
    .min(1, "Minimal 1 order item"),
});
