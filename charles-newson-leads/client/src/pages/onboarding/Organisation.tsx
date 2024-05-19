import React from "react";
import AccessLayout from "../../components/layouts/AccessLayout";
import UserErrorInterface from "../../interface/UserErrorInterface";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { AppContext } from "../../context/Context";
import InputName from "../../components/input/InputName";
import InputPcode from "../../components/input/InputPcode";
import InputNumber from "../../components/input/InputNumber";
import InputFile from "../../components/input/InputFile";
import validateOrganisation from "../../functions/validateOrganisation";
import axios from "axios";
import { BASE_URL } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import InputEmail from "../../components/input/InputEmail";

export default function Organisation() {
  const {
    user,
    setLoading,
    setOrganisation,
    setWorkspaces: setOrgworkspace,
    workspaces: Orgworkspace,
  } = React.useContext(AppContext);

  const navigate = useNavigate();

  const [error, setError] = React.useState<UserErrorInterface>({
    message: "",
    hasError: false,
    field: "",
  });

  const [org, setOrg] = React.useState({
    name: "",
    email: "",
    logo: "",
    website: "",
    type: "",
  });

  const [phoneNumber, setPhoneNumber] = React.useState({
    pCode: "",
    number: "",
  });

  function handleChanges(type: string, value: string) {
    setPhoneNumber({ ...phoneNumber, [type]: value });
  }

  function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (error.hasError) {
      setError({
        message: "",
        hasError: false,
        field: "",
      });
    }
    setOrg({ ...org, [e.target.name]: e.target.value });
  }

  async function UploadFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files!.length === 0) return;
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
          setOrg({ ...org, logo: downloadURL });
        });
      }
    );
    setLoading(false);
  }

  async function submit() {
    console.log(org);
    let errors: UserErrorInterface = validateOrganisation({
      ...org,
      phone: phoneNumber.pCode + "-" + phoneNumber.number,
    });
    if (errors.hasError) {
      setError(errors);
      return;
    }
    setLoading(true);

    const response = await axios
      .post(BASE_URL + "/register-organisation", {
        ...org,
        phone: phoneNumber.pCode + "-" + phoneNumber.number,
        uid: localStorage.getItem("uid") || user.uid,
        session: localStorage.getItem("session") || user.session,
        access_token: localStorage.getItem("token") || user.access_token,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err.response.data;
      });

    if (response.message === "Organisation created successfully") {
      localStorage.setItem(
        "organisation-email",
        response.organisation.organisation_email
      );
      localStorage.setItem(
        "organisation-id",
        response.organisation.organisation_id
      );
      localStorage.setItem(
        "organisation-name",
        response.organisation.organisation_name
      );

      setOrganisation(response.organisation);
      await createWorkspace(response.organisation.organisation_id);

      setLoading(false);
      window.location.href = "/onboarding/organisation-address";
    } else {
      alert(response.errors.message);
      setLoading(false);
      return;
    }
    if (response.token) {
      alert(response.errors.message);
      setLoading(false);
    }
    setLoading(false);
  }

  async function createWorkspace(organisation_id: string) {
    const data = {
      organisation_id: organisation_id,
      uid: user.uid,
      access_token: user.access_token,
      session: user.session,
      workspace_name: "My Workspace",
      workspace_desc: "Default Workspace",
      workspace_admin: user.uid,
    };

    let res = await axios
      .post(BASE_URL + "/register-workspace", data)
      .then((res) => res.data)
      .catch((err) => err.response.data);

    if (res.message !== "Workspace created successfully") {
      alert(res.message);
      return;
    }
    setOrgworkspace([...Orgworkspace, res.workspace]);
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
      <AccessLayout page="organisation">
        <h2 className="text-center mb-4 text-2xl font-semibold md:text-4xl">
          Organisation Details
        </h2>
        <div className="md:w-11/12 w-full mx-auto">
          <InputName
            label="Organisation Name"
            defValue=""
            placeholder="Enter Organisation Name"
            name="name"
            onChangeHandler={onChangeHandler}
            error={error.field === "name" ? error.message : ""}
          />

          <div className="mt-3 w-[95%] mx-auto">
            <p className="text-[16px] block leading-[24px] text-[#23262F] font-[700] ml-2">
              Phone Number
            </p>
            <div className="flex justify-between items-center w-full">
              <InputPcode
                defValue={""}
                inputClassName="w-2/6"
                onChange={handleChanges}
                name="pCode"
                error={
                  error.field === "pCode" && error.hasError ? error.message : ""
                }
              />
              <InputNumber
                defValue={""}
                inputClassName="w-[64%] "
                onChange={handleChanges}
                name="number"
                error={
                  error.field === "number" && error.hasError
                    ? error.message
                    : ""
                }
              />
            </div>
          </div>

          <InputEmail
            label="Email"
            defValue=""
            placeholder="Enter Email"
            name="email"
            onChangeHandler={onChangeHandler}
            error={error.field === "email" ? error.message : ""}
          />

          <InputFile
            label="Upload Logo"
            defValue={org.logo}
            name="logo"
            onChangeHandler={UploadFile}
            error={error.field === "logo" ? error.message : ""}
          />

          <InputName
            label="Website"
            defValue=""
            placeholder="Enter Website"
            name="website"
            onChangeHandler={onChangeHandler}
            error={error.field === "website" ? error.message : ""}
          />

          <InputName
            label="Organisation Type"
            defValue=""
            placeholder="Enter Organisation Type"
            name="type"
            onChangeHandler={onChangeHandler}
            error={error.field === "type" ? error.message : ""}
          />

          <button
            className="btn btn-info w-[364px] ml-[13px] md:ml-0 md:w-full my-3 text-white"
            onClick={submit}
          >
            Create Organisation
          </button>
        </div>
      </AccessLayout>
    </>
  );
}
