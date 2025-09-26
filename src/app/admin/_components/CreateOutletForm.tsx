"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { FC } from "react";
import { useCities } from "../_hooks/useCities";
import { useCreateOutlet } from "../_hooks/useOutlets";
import { CreateOutletSchema } from "../schema/create-outlet.schema";
import { MapSelector } from "./MapPicker";

const CreateOutletForm: FC = () => {
  const { data: cities = [], isLoading: isCitiesLoading } = useCities();
  const { mutateAsync: createOutlet, isPending } = useCreateOutlet();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Create Outlet</h2>

      <Formik
        initialValues={{
          name: "",
          code: "",
          address: "",
          phoneNumber: "",
          cityId: "",
          postalCode: "",
          latitude: "",
          longitude: "",
          coverageArea: "",
        }}
        validationSchema={CreateOutletSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createOutlet({
              ...values,
              latitude: Number(values.latitude),
              longitude: Number(values.longitude),
              coverageArea: Number(values.coverageArea),
            });
            resetForm();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-4">
            {/* Name */}
            <div>
              <Field as={Input} name="name" placeholder="Outlet Name" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div>
              <Field
                as={Input}
                name="code"
                placeholder="Outlet Code. ex: SBY or JKT"
              />
              <ErrorMessage
                name="code"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Address */}
            <div>
              <Field
                as={Textarea}
                name="address"
                placeholder="Outlet Address"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Phone Number */}
            <div>
              <Field as={Input} name="phoneNumber" placeholder="Phone Number" />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* City */}
            <div>
              <Select
                onValueChange={(val) => setFieldValue("cityId", val)}
                value={values.cityId}
              >
                {" "}
                <SelectTrigger>
                  {" "}
                  <SelectValue placeholder="Select City" />{" "}
                </SelectTrigger>{" "}
                <SelectContent className="z-[9999]">
                  {" "}
                  {isCitiesLoading ? (
                    <SelectItem value="loading">Loading...</SelectItem>
                  ) : (
                    cities
                      ?.filter((city: any) => city.cityId)
                      .map((city: any) => (
                        <SelectItem key={city.cityId} value={city.cityId}>
                          {" "}
                          {city.cityName}{" "}
                        </SelectItem>
                      ))
                  )}{" "}
                </SelectContent>{" "}
              </Select>
              <ErrorMessage
                name="cityId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Postal Code */}
            <div>
              <Field as={Input} name="postalCode" placeholder="Postal Code" />
              <ErrorMessage
                name="postalCode"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            {/* Map Picker */}
            <div>
              <p className="mb-2 text-sm text-gray-600">
                Click map to set coordinates
              </p>
              <MapSelector
                onPick={({ lat, lng }) => {
                  setFieldValue("latitude", lat);
                  setFieldValue("longitude", lng);
                }}
              />
              {values.latitude && values.longitude && (
                <p className="mt-2 text-sm">
                  Lat: {values.latitude}, Lng: {values.longitude}
                </p>
              )}
            </div>

            {/* Latitude */}
            <div>
              <Field
                as={Input}
                name="latitude"
                placeholder="Latitude. ex: -6.12345"
                type="number"
              />
              <ErrorMessage
                name="latitude"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Longitude */}
            <div>
              <Field
                as={Input}
                name="longitude"
                placeholder="Longitude. ex: 106.12345"
                type="number"
              />
              <ErrorMessage
                name="longitude"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Coverage Area */}
            <div>
              <Field
                as={Input}
                name="coverageArea"
                placeholder="Coverage Area (km)"
                type="number"
              />
              <ErrorMessage
                name="coverageArea"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Outlet"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOutletForm;
