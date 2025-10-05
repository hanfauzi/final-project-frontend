"use client";

import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Loading from "@/components/Loading";
import {
  UpdateOutletFormValues,
  updateOutletValidationSchema,
} from "../schema/update-outlet.schema";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCities } from "../_hooks/useCities";
import dynamic from "next/dynamic";

interface UpdateOutletFormProps {
  initialValues: UpdateOutletFormValues;
  onSubmit: (values: UpdateOutletFormValues) => void;
  onCancel: () => void;
  isPending?: boolean;
}
interface City {
  cityId: string;
  cityName: string;
}

const MapSelector = dynamic(() => import("./MapPicker").then(mod => mod.MapSelector), {
  ssr: false,
});

export const UpdateOutletForm: FC<UpdateOutletFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isPending = false,
}) => {
const { data: cities = [], isLoading: isCitiesLoading } = useCities();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={updateOutletValidationSchema}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-4 w-full">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <Field as={Input} name="name" placeholder="Outlet name" />
            <ErrorMessage
              name="name"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Address</label>
            <Field as={Textarea} name="address" placeholder="Outlet address" />
            <ErrorMessage
              name="address"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <Field as={Input} name="phoneNumber" placeholder="Phone number" />
            <ErrorMessage
              name="phoneNumber"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

           {/* City */}
          <div>
            <label className="block font-semibold mb-1">City</label>
            <Select
              onValueChange={(val) => setFieldValue("cityId", val)}
              value={values.cityId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {isCitiesLoading ? (
                  <SelectItem value="loading">Loading...</SelectItem>
                ) : (
                  cities.map((city: City) => (
                    <SelectItem key={city.cityId} value={city.cityId}>
                      {city.cityName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <ErrorMessage
              name="cityId"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Postal Code */}
          <div>
            <label className="block font-semibold mb-1">Postal Code</label>
            <Field as={Input} name="postalCode" placeholder="Postal Code" />
            <ErrorMessage
              name="postalCode"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

           {/* Map Picker */}
          <div>
            <p className="mb-2 text-sm text-gray-600">
              Click map to update coordinates
            </p>
            <MapSelector
              onPick={({ lat, lng }) => {
                setFieldValue("latitude", lat);
                setFieldValue("longitude", lng);
              }}
              initialLat={Number(values.latitude)}
              initialLng={Number(values.longitude)}
            />
            {values.latitude && values.longitude && (
              <p className="mt-2 text-sm">
                Lat: {values.latitude}, Lng: {values.longitude}
              </p>
            )}
          </div>

          {/* Latitude */}
          <div>
            <label className="block font-semibold mb-1">Latitude</label>
            <Field
              as={Input}
              name="latitude"
              placeholder="Latitude. ex: -6.12345"
              type="number"
            />
            <ErrorMessage
              name="latitude"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Longitude */}
          <div>
            <label className="block font-semibold mb-1">Longitude</label>
            <Field
              as={Input}
              name="longitude"
              placeholder="Longitude. ex: 106.12345"
              type="number"
            />
            <ErrorMessage
              name="longitude"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Coverage Area */}
          <div>
            <label className="block font-semibold mb-1">Coverage Area (km)</label>
            <Field
              as={Input}
              name="coverageArea"
              placeholder="Coverage Area"
              type="number"
            />
            <ErrorMessage
              name="coverageArea"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="block font-semibold">Active</label>
            <Switch
              checked={values.isActive}
              onCheckedChange={(checked) =>
                setFieldValue("isActive", checked)
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  className="cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? <Loading /> : "Save"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure the outlet information is correct?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel disabled={isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onSubmit(values)}
                    disabled={isPending}
                  >
                    {isPending ? <Loading /> : "Confirm"}
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Form>
      )}
    </Formik>
  );
};
