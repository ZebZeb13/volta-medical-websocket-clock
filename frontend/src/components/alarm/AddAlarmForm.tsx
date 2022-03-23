import React, { memo, useCallback, useEffect } from "react";
import { DateTimePicker } from "@mui/lab";
import { Stack, TextField, Button } from "@mui/material";
import { zonedTimeToUtc } from "date-fns-tz";
import { Alarm } from "../../model/Alarm";
import { useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { Timezone } from "../../model/Timezone";

const FormFullWidth = styled.form`
  width: 100%;
`;

const validationSchema = yup.object({
  label: yup.string().required("Label is required"),
  date: yup.date().required("Date is required").typeError("Invalid date")
});

interface AddAlarmFormProps {
  timezone: Timezone;
  onAdd: (alarm: Alarm & { timezoneOffset: number }) => void;
}
export const AddAlarmForm = memo((props: AddAlarmFormProps) => {
  const { timezone, onAdd } = props;

  const formik = useFormik({
    initialValues: {
      label: "",
      date: zonedTimeToUtc(new Date(), timezone.value)
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(timezone.offset);
      onAdd({
        label: values.label,
        timestamp: values.date.getTime() / 1000,
        timezoneOffset: timezone.offset ?? 0
      });
    }
  });

  const handleChangeDate = useCallback(
    (newValue: Date | null) => {
      if (newValue) {
        const newDate = newValue;
        newDate.setSeconds(0, 0);
        formik.setFieldValue("date", newDate);
      }
    },
    [formik]
  );

  useEffect(() => {
    formik.setFieldValue("date", zonedTimeToUtc(new Date(), timezone.value));
  }, [timezone]);

  return (
    <FormFullWidth onSubmit={formik.handleSubmit}>
      <Stack direction="row" gap={1}>
        <TextField
          fullWidth
          id="label"
          name="label"
          label="Label"
          value={formik.values.label}
          onChange={formik.handleChange}
          error={formik.touched.label && Boolean(formik.errors.label)}
          helperText={formik.touched.label && formik.errors.label}
        />
        <DateTimePicker
          label="Date"
          renderInput={(inputProps) => (
            <TextField
              fullWidth
              name="date"
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              {...inputProps}
            />
          )}
          value={formik.values.date}
          onChange={handleChangeDate}
        />
        <Button type="submit">add alarm</Button>
      </Stack>
    </FormFullWidth>
  );
});
