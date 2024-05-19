import React from "react";
import { Form } from "react-bootstrap";

import InputCountry from "../input/InputCountry";
import InputName from "../input/InputName";
import InputNumber from "../input/InputNumber";
import InputPass from "../input/InputPass";
import UserErrorInterface from "../../interface/UserErrorInterface";

export default function ProxyForm({
  handleChange,
  values,
  errors,
}: {
  handleChange: (type: string, value: string | boolean) => void;
  errors: UserErrorInterface;
  values: any;
}) {
  return (
    <div>
      <Form.Label>Your regular login location</Form.Label>
      <InputCountry
        name="country"
        onChange={handleChange}
        defValue=""
        placeholder="Select country"
        error={
          errors.hasError && errors.field === "country" ? errors.message : ""
        }
      />
      <Form.Check
        className="mt-3 mb-3"
        id="custom-proxy-checkbox"
        label="Use my own HTTP proxy"
        checked={values.isCustom}
        onChange={(e) => handleChange("isCustom", e.target.checked)}
      />
      <p className="text-md text-red-500">
        {errors.hasError && errors.field === "isCustom" ? errors.message : ""}
      </p>

      {values.isCustom && (
        <div>
          <Form.Check
            className="mt-3 mb-3"
            id="proxy-domain-checkbox"
            label="Use domain"
            onChange={(e) => handleChange("isDomain", e.target.checked)}
          />
          <div className="flex mt-3 mb-3 ">
            <Form.Group className="me-2">
              <InputName
                label={!values.isDomain ? "IP" : "Domain"}
                name={!values.isDomain ? "ip" : "domain"}
                defValue={!values.isDomain ? values.ip : values.domain}
                onChange={handleChange}
                placeholder={
                  !values.isDomain ? "87.246.34.123" : "my.domain.com"
                }
                error={
                  errors.hasError &&
                  errors.field === (!values.isDomain ? "ip" : "domain")
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>

            <Form.Group className="me-2">
              <InputNumber
                label="Port"
                name="port"
                defValue={values.port}
                onChange={handleChange}
                placeholder="8080"
                error={
                  errors.hasError && errors.field === "port"
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>

            <Form.Group className="me-2">
              <InputName
                label="Username"
                name="username"
                defValue={values.username}
                onChange={handleChange}
                placeholder="Username"
                error={
                  errors.hasError && errors.field === "username"
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>

            <Form.Group className="me-2">
              <InputPass
                label="Password"
                name="password"
                defValue={values.password}
                onChange={handleChange}
                placeholder="Password"
                error={
                  errors.hasError && errors.field === "password"
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>
          </div>
        </div>
      )}
    </div>
  );
}
