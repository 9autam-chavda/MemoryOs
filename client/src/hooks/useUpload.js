import { useContext } from "react";
import { UploadContext } from "../contexts/UploadContext";

function useUpload() {

  return useContext(UploadContext);

}

export default useUpload;