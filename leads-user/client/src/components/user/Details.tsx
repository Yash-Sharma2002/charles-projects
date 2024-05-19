import React from "react";
import { AppContext } from "../../context/Context";
import { MdEdit } from "react-icons/md";
import InputName from "../input/InputName";
import UserErrorInterface from "../../interface/UserErrorInterface";
import InputEmail from "../input/InputEmail";
import { MdCancel } from "react-icons/md";
import InputFile from "../input/InputFile";
import InputCountry from "../input/InputCountry";
import InputPcode from "../input/InputPcode";
import InputNumber from "../input/InputNumber";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../constants/api";
import axios from "axios";
import Loader from "../loader/Loader";

export default function Details() {
  const {
    organisation,
    user,
    address: userAddress,
  } = React.useContext(AppContext);

  const params = useParams();
  const { uid } = params;

  const getUserDetails = React.useRef(() => {});
  const [loading, setLoading] = React.useState(false);

  const [userDetails, setUserDetails] = React.useState({
    uid: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    access_token: "",
    session: "",
    provider: "",
    profile: "",
    status: "",
  });

  const [phoneNumber, setPhoneNumber] = React.useState({
    country_code: "",
    phone_number: "",
  });

  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
  });

  const [userWorkspaces, setWorkspaces] = React.useState([]);

  function handleChanges(type: string, value: string) {
    setPhoneNumber({ ...phoneNumber, [type]: value });
  }

  function onOrganisationChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (error.hasError) {
      setError({
        message: "",
        hasError: false,
        field: "",
      });
    }
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  }

  function onAddressChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (error.hasError) {
      setError({
        message: "",
        hasError: false,
        field: "",
      });
    }
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  const [address, setAddress] = React.useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    postal_code: 0,
  });

  const [edit, setEdit] = React.useState(false);

  async function UploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const fileType = e.target.files![0].type;

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      setError({
        hasError: true,
        message: "Please upload a valid image file",
        field: "file",
      });
      return;
    }

    if (e.target.files![0].size > 1000000) {
      setError({
        hasError: true,
        message: "File size should be less than 1MB",
        field: "file",
      });
      return;
    }
    if (e.target.files![0].size > 1000000) {
      setError({
        hasError: true,
        message: "File size should be less than 1MB",
        field: "file",
      });
      return;
    }

    setLoading(true);
    const file = e.target.files![0];
    const storageRef = ref(
      storage,
      `designs/before/${user.email + "_" + file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        setError({
          hasError: true,
          message: error.message,
          field: "file",
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUserDetails({
            ...userDetails,
            profile: downloadURL,
          });
          setLoading(false);
        });
      }
    );
    setLoading(false);
  }

  getUserDetails.current = async () => {
    setLoading(true);
    const res = await axios
      .get(
        BASE_URL +
          "/get-user?" +
          new URLSearchParams({
            uid: uid || "",
            access_token: user.access_token || "",
            session: user.session || "",
          })
      )
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res.user) {
      setUserDetails(res.user);
    }
    if (res.workspaces) {
      setWorkspaces(res.workspaces);
    }
    if (res.address) {
      setAddress(res.address);
    }
    if (res.user.phone) {
      setPhoneNumber({
        country_code: res.user.phone.split("-")[0],
        phone_number: res.user.phone.split("-")[1],
      });
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setLoading(true);
    if (!uid) {
      if (user.phone) {
        setPhoneNumber({
          country_code: user.phone.split("-")[0],
          phone_number: user.phone.split("-")[1],
        });
      }
      setAddress(userAddress);
      setUserDetails(user);
    } else {
      getUserDetails.current();
    }
    setLoading(false);
  }, [user, uid, userAddress]);

  async function saveDetails() {}

  return (
    <div className="user-settings-content main-bg p-4 custom-scrollbar">
      <h1 className="text-2xl font-bold">User Details</h1>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex justify-between w-full py-2 items-center">
            {!edit ? (
              <button
                className="px-3 py-2 rounded-md  btn-info shadow-xl text-white flex justify-center"
                onClick={() => setEdit(!edit)}
              >
                <MdEdit className="text-white mr-2 mt-[2px] text-[20px]" />
                Edit
              </button>
            ) : (
              <button
                className="px-3 py-2 rounded-md  btn-info shadow-xl text-white flex justify-center"
                onClick={() => setEdit(!edit)}
              >
                <MdCancel className="text-white mr-2 mt-[2px] text-[20px]" />
                Cancel
              </button>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center w-full flex-col md:flex-row">
              <InputName
                label="User Name"
                defValue={userDetails.username || ""}
                disabled={!edit}
                inputClassName="md:w-1/2 w-full mr-2"
                onChangeHandler={onOrganisationChangeHandler}
                placeholder="Enter User Name"
                name="username"
                error={error.field === "username" ? error.message : undefined}
              />

              <InputEmail
                label="Email"
                defValue={userDetails.email || ""}
                disabled={!edit}
                inputClassName="md:w-1/2 w-full"
                onChangeHandler={onOrganisationChangeHandler}
                placeholder="Enter Email"
                name="email"
                error={error.field === "email" ? error.message : undefined}
              />
            </div>

            <InputName
              label="Status"
              defValue={userDetails.status || ""}
              disabled={!edit && organisation.role === "admin"}
              onChangeHandler={onOrganisationChangeHandler}
              placeholder="Enter Status"
              name="status"
              error={error.field === "status" ? error.message : undefined}
            />

            <div className="my-3">
              <p className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ">
                Phone Number
              </p>
              <div className="flex justify-between items-center  w-full">
                <InputPcode
                  defValue={phoneNumber.country_code || ""}
                  inputClassName="w-2/6"
                  onChange={handleChanges}
                  disabled={!edit}
                  name="country_code"
                  error={
                    error.field === "country_code" && error.hasError
                      ? error.message
                      : ""
                  }
                />
                <InputNumber
                  defValue={phoneNumber.phone_number || ""}
                  inputClassName="w-4/6 ml-2"
                  onChange={handleChanges}
                  disabled={!edit}
                  name="phone_number"
                  error={
                    error.field === "phone_number" && error.hasError
                      ? error.message
                      : ""
                  }
                />
              </div>
            </div>

            <InputFile
              label="Profile Picture"
              defValue={userDetails.profile || ""}
              disabled={!edit}
              onChangeHandler={UploadFile}
              placeholder="Profile Picture"
              name="profile"
              error={error.field === "profile" ? error.message : undefined}
            />

            <div className="flex justify-between items-center w-full flex-col md:flex-row">
              <InputName
                label="Address Line 1"
                defValue={address.address_line1 || ""}
                disabled={!edit}
                onChangeHandler={onAddressChangeHandler}
                inputClassName="md:w-1/2 w-full mr-2"
                placeholder="Enter Address Line 1"
                name="address_line1"
                error={
                  error.field === "address_line1" ? error.message : undefined
                }
              />

              <InputName
                label="Address Line 2"
                defValue={address.address_line2 || ""}
                disabled={!edit}
                onChangeHandler={onAddressChangeHandler}
                inputClassName="md:w-1/2 w-full"
                placeholder="Enter Address Line 2"
                name="address_line2"
                error={
                  error.field === "address_line2" ? error.message : undefined
                }
              />
            </div>

            <div className="flex justify-between items-center w-full flex-col md:flex-row">
              <InputName
                label="City"
                defValue={address.city || ""}
                disabled={!edit}
                onChangeHandler={onAddressChangeHandler}
                inputClassName="md:w-1/2 w-full mr-2"
                placeholder="Enter City"
                name="city"
                error={error.field === "city" ? error.message : undefined}
              />

              <InputName
                label="State"
                defValue={address.state || ""}
                disabled={!edit}
                onChangeHandler={onAddressChangeHandler}
                inputClassName="md:w-1/2 w-full"
                placeholder="Enter State"
                name="state"
                error={error.field === "state" ? error.message : undefined}
              />
            </div>

            <div className="flex justify-between items-center w-full flex-col md:flex-row">
              <InputCountry
                label="Country"
                defValue={address.country || ""}
                disabled={!edit}
                inputClassName="md:w-1/2 w-full mr-2"
                onChangeHandler={onAddressChangeHandler}
                placeholder="Enter Country"
                name="country"
                error={error.field === "country" ? error.message : undefined}
              />

              <InputName
                label="Postal Code"
                defValue={
                  address.postal_code ? address.postal_code.toString() : ""
                }
                disabled={!edit}
                inputClassName="md:w-1/2 w-full"
                onChangeHandler={onAddressChangeHandler}
                placeholder="Enter Postal Code"
                name="postal_code"
                error={
                  error.field === "postal_code" ? error.message : undefined
                }
              />
            </div>

            <div className="my-3">
              <p className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ">
                Workspaces
              </p>
              <div className="flex justify-start items-center flex-wrap">
                {userWorkspaces.map((item: any, idx: number) => {
                  return (
                    <a
                      href={"/workspace/" + item.workspace_id}
                      key={idx}
                      className={
                        "workspace-box box-card p-4 mb-3 me-3 mx-2 text-center d-flex justify-content-center align-items-center "
                      }
                    >
                      <p className="workspace-name">{item.workspace_name}</p>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {edit && (
            <div className="flex justify-center">
              <button
                className="px-3 py-2 rounded-md  btn-info shadow-xl text-white flex justify-center"
                onClick={saveDetails}
              >
                Save
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
