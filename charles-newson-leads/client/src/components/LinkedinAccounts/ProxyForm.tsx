import React from "react";
import { Form } from "react-bootstrap";

import InputCountry from "../input/InputCountry";
import InputName from "../input/InputName";
import InputNumber from "../input/InputNumber";
import InputPass from "../input/InputPass";
import UserErrorInterface from "../../interface/UserErrorInterface";

export default function ProxyForm({
  handleChange,
  onChange,
  values,
  errors,
}: {
  handleChange: (type: string, value: string | boolean) => void;
  errors: UserErrorInterface;
  values: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        checked={values.use_custom_proxy}
        onChange={(e) => handleChange("use_custom_proxy", e.target.checked)}
      />
      <p className="text-md text-red-500">
        {errors.hasError && errors.field === "use_custom_proxy"
          ? errors.message
          : ""}
      </p>

      {values.use_custom_proxy && (
        <div>
          <Form.Check
            className="mt-3 mb-3"
            id="proxy-domain-checkbox"
            label="Use domain"
            onChange={(e) => handleChange("isDomain", e.target.checked)}
          />
          <p className="text-md text-red-500"></p>
          <div className="d-flex mt-3 mb-3">
            <Form.Group className="me-2">
              <InputName
                label={!values.isDomain ? "IP" : "Domain"}
                name="custom_proxy_server"
                defValue={values.custom_proxy_server}
                onChangeHandler={onChange}
                placeholder={
                  !values.isDomain ? "87.246.34.123" : "my.domain.com"
                }
                error={
                  errors.hasError && errors.field === "custom_proxy_server"
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>

            <Form.Group className="me-2">
              <InputNumber
                label="Port"
                name="custom_proxy_port"
                defValue={values.custom_proxy_port}
                onChangeHandler={onChange}
                placeholder="8080"
                error={
                  errors.hasError && errors.field === "custom_proxy_port"
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>

            <Form.Group className="me-2">
              <InputName
                label="Username"
                name="custom_proxy_username"
                defValue={values.custom_proxy_username}
                onChangeHandler={onChange}
                placeholder="Username"
                error={
                  errors.hasError && errors.field === "custom_proxy_username"
                    ? errors.message
                    : ""
                }
              />
            </Form.Group>

            <Form.Group className="me-2">
              <InputPass
                label="Password"
                name="custom_proxy_password"
                defValue={values.custom_proxy_password}
                onChangeHandler={onChange}
                placeholder="Password"
                error={
                  errors.hasError && errors.field === "custom_proxy_password"
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
