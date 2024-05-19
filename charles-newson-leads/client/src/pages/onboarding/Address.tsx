import React from "react";
import AccessLayout from "../../components/layouts/AccessLayout";
import UserErrorInterface from "../../interface/UserErrorInterface";
import { AppContext } from "../../context/Context";
import InputName from "../../components/input/InputName";
import axios from "axios";
import { BASE_URL } from "../../constants/api";
import InputCountry from "../../components/input/InputCountry";
import validateAddress from "../../functions/validateAddress";
// import { useNavigate } from "react-router-dom";

export default function AddressOrg() {
  const {
    user,
    setLoading,
    organisation,
    setAddress: setOrgAddress,
  } = React.useContext(AppContext);

  // const navigate = useNavigate();

  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
  });

  const [address, setAddress] = React.useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: 0,
  });

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (error.hasError) {
      setError({
        message: "",
        hasError: false,
        field: "",
      });
    }
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  async function submit() {
    let errors: UserErrorInterface = validateAddress(address);
    if (errors.hasError) {
      setError(errors);
      return;
    }
    setLoading(true);

    const response = await axios
      .post(BASE_URL + "/register-address", {
        ...address,
        relation_id: organisation.organisation_id,
        uid: user.uid,
        session: user.session,
        access_token: user.access_token,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    if (response.message === "Address created successfully") {
      setOrgAddress(response.address);
      setLoading(false);

      window.location.href = "/";
    }
    if (response.token) {
      alert(response.errors.message);
    }
    setLoading(false);
  }

  function onCountryChange(type: string, value: string) {
    setAddress({ ...address, [type]: value });
  }

  // React.useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     if (!organisation.organisation_id) {
  //       navigate("/sign-in");
  //     }
  //   }
  // }, [navigate,organisation]);

  return (
    <>
      <AccessLayout page="address">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Organisation Address
        </h2>
        <div className="md:w-11/12 w-full mx-auto">
          <InputName
            name="address_line1"
            defValue=""
            label="Address Line 1"
            placeholder="Enter Address Line 1"
            onChangeHandler={onChangeHandler}
            error={error.field === "address_line1" ? error.message : undefined}
          />

          <InputName
            name="address_line2"
            defValue=""
            label="Address Line 2"
            placeholder="Enter Address Line 2"
            onChangeHandler={onChangeHandler}
            error={error.field === "address_line2" ? error.message : undefined}
          />

          <InputName
            name="city"
            defValue=""
            label="City"
            placeholder="Enter City"
            onChangeHandler={onChangeHandler}
            error={error.field === "city" ? error.message : undefined}
          />

          <InputName
            name="postal_code"
            defValue=""
            label="Postal Code"
            placeholder="Enter Postal Code"
            onChangeHandler={onChangeHandler}
            error={error.field === "postal_code" ? error.message : undefined}
          />

          <InputName
            name="state"
            defValue=""
            label="State"
            placeholder="Enter State"
            onChangeHandler={onChangeHandler}
            error={error.field === "state" ? error.message : undefined}
          />

          <InputCountry
            name="country"
            defValue=""
            label="Country"
            placeholder="Enter Country"
            onChange={onCountryChange}
            error={error.field === "country" ? error.message : undefined}
          />

          <button
            className="btn  btn-info mx-2 w-[364px] ml-[13px] md:ml-0 md:w-full my-3 text-white"
            onClick={submit}
          >
            Save Address
          </button>
        </div>
      </AccessLayout>
    </>
  );
}
