import React from "react";
import { AppContext } from "../../context/Context";
import axios from "axios";
import { Tabs, Tab, Modal } from "react-bootstrap";
import { OrganisationAPI, UserAPI } from "../../constants/api";
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
import validateOrganisation from "../../functions/validateOrganisation";
import WorkspaceMemberItem from "../Workspace/WorkspaceMemberItem";
import Loader from "../loader/Loader";
import ResStatus from "../../constants/ResStatus";
import InputSelect from "../input/InputSelect";
import Roles from "../../constants/Roles";

export default function Details() {
  const { organisation, user } = React.useContext(AppContext);
  const [OrganisationDetails, setOrganisationDetails] = React.useState({
    organisation_id: "",
    organisation_name: "",
    organisation_email: "",
    organisation_phone: "",
    organisation_website: "",
    organisation_description: "",
    organisation_image: "",
    organisation_type: "",
  });

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [phoneNumber, setPhoneNumber] = React.useState({
    country_code: "",
    phone_number: "",
  });

  const [activeTab, setActiveTab] = React.useState(0);

  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
  });

  function handleChanges(type: string, value: string) {
    setPhoneNumber({ ...phoneNumber, [type]: value });
  }

  const [addUser, setAddUser] = React.useState(false);
  const [inviteFields, setInviteFields] = React.useState({
    email: "",
    name: "",
    role: "",
  });

  function onOrganisationChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (error.hasError) {
      setError({
        message: "",
        hasError: false,
        field: "",
      });
    }
    setOrganisationDetails({
      ...OrganisationDetails,
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
    address_id: "",
    address_line1: "",
    address_line2: "",
    address_city: "",
    address_state: "",
    address_country: "",
    address_postal_code: "",
  });

  const [edit, setEdit] = React.useState(false);

  const [adminRight, setAdminRight] = React.useState(false);

  const getOrganisationDetails = React.useRef(() => {});
  const getOrganisationUsers = React.useRef(() => {});

  getOrganisationDetails.current = async () => {
    try {
      setLoading(true);
      const res = await axios
        .get(
          OrganisationAPI +
            "/get?" +
            new URLSearchParams({
              organisation_id: organisation.organisation_id,
              uid: user.uid,
              session: user.session,
              access_token: user.access_token,
            })
        )
        .then((res) => res.data)
        .catch((err) => err.response.data);

      if (res.status !== ResStatus.Success) {
        alert(res.message);
        setLoading(false);
        return;
      }

      setOrganisationDetails(res.data.orgDetails);
      setPhoneNumber({
        country_code: res.data.orgDetails.organisation_phone.split("-")[0],
        phone_number: res.data.orgDetails.organisation_phone.split("-")[1],
      });
      setAddress(res.data.address);
      setLoading(false);
    } catch (error) {}
    setLoading(false);
  };

  getOrganisationUsers.current = async function () {
    setLoading(true);
    const params = {
      organisation_id: organisation.organisation_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
    };

    let res = await axios
      .get(OrganisationAPI + "/users?" + new URLSearchParams(params))
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res.status !== ResStatus.Success) {
      alert(res.message);
      setLoading(false);
      return;
    }
    setUsers(res.data);

    console.log(res.data);

    setLoading(false);
  };

  async function inviteUser() {
    setLoading(true);
    const params = {
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
      invite: {
        email: inviteFields.email,
        organisation_id: organisation.organisation_id,
        sent_by: user.uid,
        name: inviteFields.name,
        role: inviteFields.role,
      },
    };

    let data = await axios
      .post(UserAPI + "/invitations/invite", params)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (data.status !== ResStatus.Success) {
      alert(data.message);
      setLoading(false);
    } else {
      alert(data.message);
      setLoading(false);
    }
  }

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
          setOrganisationDetails({
            ...OrganisationDetails,
            organisation_image: downloadURL,
          });
          setLoading(false);
        });
      }
    );
    setLoading(false);
  }

  async function saveDetails() {
    let error: UserErrorInterface = validateOrganisation({
      name: OrganisationDetails.organisation_name,
      email: OrganisationDetails.organisation_email,
      phone: phoneNumber.country_code + "-" + phoneNumber.phone_number,
      website: OrganisationDetails.organisation_website,
      logo: OrganisationDetails.organisation_image,
    });

    if (error.hasError) {
      setError(error);
      return;
    }

    // need to call update api
  }

  React.useEffect(() => {
    getOrganisationDetails.current();
  }, [user]);

  React.useEffect(() => {
    if (activeTab === 1) getOrganisationUsers.current();
  }, [activeTab, users.length]);

  return (
    <>
      <Modal show={addUser} onHide={() => setAddUser(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputEmail
            label="Email"
            defValue={inviteFields.email || ""}
            onChangeHandler={(e) =>
              setInviteFields({ ...inviteFields, email: e.target.value })
            }
            inputClassName="w-full"
            placeholder="Enter Email"
            name="email"
            error={error.field === "email" ? error.message : undefined}
          />

          <InputName
            label="Name"
            defValue={inviteFields.name || ""}
            onChangeHandler={(e) =>
              setInviteFields({ ...inviteFields, name: e.target.value })
            }
            inputClassName="w-full"
            placeholder="Enter Name"
            name="name"
            error={error.field === "name" ? error.message : undefined}
          />

          <InputSelect
            label="Role"
            defValue={inviteFields.role || ""}
            onChangeHandler={(e) =>
              setInviteFields({ ...inviteFields, role: e.target.value })
            }
            inputClassName="w-full"
            placeholder="Select Role"
            selectArray={Object.keys(Roles).map((item, index) => {
              return { value: item, name: item, id: index.toString() };
            })}
            name="role"
            error={error.field === "role" ? error.message : undefined}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary max-h-[unset] h-[unset] capitalize"
            onClick={() => setAddUser(false)}
          >
            Close
          </button>
          <button
            onClick={inviteUser}
            className="btn btn-primary max-h-[unset] h-[unset] capitalize"
          >
            Invite
          </button>
        </Modal.Footer>
      </Modal>
      <div className="user-settings-content main-bg p-4 custom-scrollbar mt-6 md:mt-0">
        <div className="flex justify-center items-center">
          {["Organisation Details", "Organisation Users"].map((item, index) => (
            <div key={index} className="flex items-center">
              <button
                onClick={() => setActiveTab(index)}
                className={
                  activeTab === index
                    ? "btn btn-primary2 mx-2"
                    : "btn btn-ghost capitalize  mx-2"
                }
              >
                {item}
              </button>
            </div>
          ))}
        </div>
        {activeTab === 0 ? (
          <>
            {loading ? (
              <Loader />
            ) : (
              <>
                <div className="flex justify-between w-full py-2 items-center">
                  {/* <h1 className="text-2xl font-bold">Organisation Details</h1> */}
                  {organisation.role === "admin" ? (
                    !edit ? (
                      <button
                        className="px-3 py-2 rounded-md  btn-primary2 shadow-xl text-black flex justify-center "
                        onClick={() => setEdit(!edit)}
                      >
                        <MdEdit className="text-white mr-2 mt-[2px] text-[20px]" />
                        Edit
                      </button>
                    ) : (
                      <button
                        className="px-3 py-2 rounded-md  btn-red shadow-xl  flex justify-center"
                        onClick={() => setEdit(!edit)}
                      >
                        <MdCancel className="text-white mr-2 text-[20px]" />
                        Cancel
                      </button>
                    )
                  ) : null}
                </div>

                <div>
                  <div className="flex justify-between items-center w-full flex-col md:flex-row">
                    <InputName
                      label="Organisation Name"
                      defValue={OrganisationDetails.organisation_name || ""}
                      disabled={!edit}
                      onChangeHandler={onOrganisationChangeHandler}
                      inputClassName="md:w-1/2 w-full mr-2"
                      placeholder="Enter Organisation Name"
                      name="organisation_name"
                      error={
                        error.field === "organisation_name"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputEmail
                      label="Organisation Email"
                      defValue={OrganisationDetails.organisation_email || ""}
                      disabled={!edit}
                      onChangeHandler={onOrganisationChangeHandler}
                      inputClassName="md:w-1/2 w-full"
                      placeholder="Enter Organisation Email"
                      name="organisation_email"
                      error={
                        error.field === "organisation_email"
                          ? error.message
                          : undefined
                      }
                    />
                  </div>

                  <div className="mt-3 w-full mx-auto">
                    <p className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ml-2">
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

                  <div className="flex justify-evenly items-center w-full flex-col md:flex-row">
                    <InputFile
                      label="Organisation Logo"
                      defValue={OrganisationDetails.organisation_image || ""}
                      disabled={!edit}
                      onChangeHandler={UploadFile}
                      inputClassName="md:w-1/2 w-full mr-2"
                      placeholder="Upload Organisation Logo"
                      name="organisation_logo"
                      error={
                        error.field === "organisation_logo"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputName
                      label="Organisation Website"
                      defValue={OrganisationDetails.organisation_website || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full"
                      onChangeHandler={onOrganisationChangeHandler}
                      placeholder="Enter Organisation Website"
                      name="organisation_website"
                      error={
                        error.field === "organisation_website"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputName
                      label="Organisation Type"
                      defValue={OrganisationDetails.organisation_type || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full"
                      onChangeHandler={onOrganisationChangeHandler}
                      placeholder="Enter Organisation Type"
                      name="organisation_type"
                      error={
                        error.field === "organisation_type"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputName
                      label="Organisation Description"
                      defValue={
                        OrganisationDetails.organisation_description || ""
                      }
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full"
                      onChangeHandler={onOrganisationChangeHandler}
                      placeholder="Enter Organisation Description"
                      name="organisation_description"
                      error={
                        error.field === "organisation_description"
                          ? error.message
                          : undefined
                      }
                    />
                  </div>

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
                        error.field === "address_line1"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputName
                      label="Address Line 2"
                      defValue={address.address_line2 || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full"
                      onChangeHandler={onAddressChangeHandler}
                      placeholder="Enter Address Line 2"
                      name="address_line2"
                      error={
                        error.field === "address_line2"
                          ? error.message
                          : undefined
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center w-full flex-col md:flex-row">
                    <InputName
                      label="City"
                      defValue={address.address_city || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full mr-2"
                      onChangeHandler={onAddressChangeHandler}
                      placeholder="Enter City"
                      name="address_city"
                      error={
                        error.field === "address_city"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputName
                      label="State"
                      defValue={address.address_state || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full"
                      onChangeHandler={onAddressChangeHandler}
                      placeholder="Enter State"
                      name="address_state"
                      error={
                        error.field === "address_state"
                          ? error.message
                          : undefined
                      }
                    />
                  </div>

                  <div className="flex justify-between items-center w-full flex-col md:flex-row">
                    <InputCountry
                      label="Country"
                      defValue={address.address_country || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full mr-2"
                      onChangeHandler={onAddressChangeHandler}
                      placeholder="Enter Country"
                      name="address_country"
                      error={
                        error.field === "address_country"
                          ? error.message
                          : undefined
                      }
                    />

                    <InputName
                      label="Postal Code"
                      defValue={address.address_postal_code || ""}
                      disabled={!edit}
                      inputClassName="md:w-1/2 w-full"
                      onChangeHandler={onAddressChangeHandler}
                      placeholder="Enter Postal Code"
                      name="address_postal_code"
                      error={
                        error.field === "address_postal_code"
                          ? error.message
                          : undefined
                      }
                    />
                  </div>
                </div>

                {edit && (
                  <div className="flex justify-end">
                    <button
                      className="px-3 py-2 rounded-md btn-primary2 shadow-xl text-white flex justify-center"
                      onClick={saveDetails}
                    >
                      Save
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <Loader />
            ) : (
              <>
                <button
                  onClick={() => setAddUser(true)}
                  className="mt-3 mb-2 text-white btn btn-primary2"
                >
                  Add User
                </button>
                <table className="table table-borderless workspace-table align-middle text-center mb-5">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Allowed LinkedIn Accounts</th>
                      <th>Has Admin Rights</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((item, index) => {
                        return (
                          <WorkspaceMemberItem
                            key={index}
                            data={item}
                            adminRight={adminRight}
                            setAdminRight={setAdminRight}
                            caller={"organisation"}
                          />
                        );
                      })
                    ) : (
                      <p>No users found</p>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
