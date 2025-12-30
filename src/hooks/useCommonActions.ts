import Swal from "sweetalert2";
import useAxios from "./useAxios";
import helpers from "../_helpers/common";
import { ChangeApprovalStatusParams } from "../types/interfaces";


const useCommonActions = () => {
  const axiosInstance = useAxios();

  //Generic API Request Handler
  const apiRequest = async (
    url: string, 
    method: "GET" | "POST" | "PUT" | "DELETE",
    data: Record<string, any>,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    try {
      const response: any = await axiosInstance({
        url,
        method,
        data,
      });

      if (!response.error) {
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("API Request Error:", error);
      onError?.(error);
    } finally {
      Swal.hideLoading();
      Swal.close();
    }
  };

  //Change Approval Status with Swal
  const changeApprovalStatus = async ({
    itemId,
    url,
    is_recuring,
    selectedOption,
    callback,
  }: ChangeApprovalStatusParams) => {
    await Swal.fire({
      title: "Select Approval Status",
      input: "select",
      inputOptions: helpers.getInputOptions(
        {
          // 0: "Pending",
          1: "Approved",
          2: "Disapproved",
        },
        selectedOption ?? ""
      ),
      inputPlaceholder: "Select a status",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      preConfirm: async (value) => {
        if (value === "") {
          Swal.showValidationMessage("You need to select a status.");
        } else {
          Swal.showLoading();
          const status = parseInt(value, 10);
          await apiRequest(
            url || "",
            "POST",
            { new_status: status, itemid: itemId, is_recurring: is_recuring },
            callback
          );
        }
      },
    });
  };

  //Change User Status (block/unblock)
  const changeItemStatus = async (
    itemId?: string,
    status?: number,
    url?: string,
    message?: string,
    callback?: () => void
  ) => {
    await Swal.fire({
      text: message,
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      preConfirm: async () => {
        await apiRequest(
          url || "",
          "POST",
          { new_status: status, itemid: itemId },
          callback
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const deleteItem = async (
    url?: string,
    message?: string,
    callback?: () => void
  ) => {
    await Swal.fire({
      //text: "Are you sure you want to delete the NPO profile?",
      text: message,
      showCancelButton: true,
      confirmButtonText: "Submit",
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        await apiRequest(url || "", "DELETE", {}, callback);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const blockUnblockUser = async (
    itemId?: string,
    new_status?: number,
    url?: string,
    callback?: () => void
  ) => {
    let operation = new_status === 1 ? "unblock" : "block";
    await Swal.fire({
      text: `Are you sure you want to ${operation} the selected user`,
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      preConfirm: async () => {
        await apiRequest(
          url || "",
          "POST",
          { itemid: itemId, new_status: new_status },
          callback
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const blockUnblockPost = async (
    itemId?: string,
    isBlocked?: boolean,
    url?: string,
    callback?: () => void
  ) => {
    await Swal.fire({
      text: `Are you sure you want to ${isBlocked ? "Unblock" : "Block"} the selected post`,
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      preConfirm: async () => {
        await apiRequest(
          url || "",
          "GET",
          { is_blocked: !isBlocked, itemid: itemId },
          callback
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  //Change Reported Status with Swal
  const updateReportedStatus = async (
    itemId?: string,
    url?: string,
    selectedOption?: string,
    callback?: () => void
  ) => {
    await Swal.fire({
      title: "Select Reported Status",
      input: "select",
      inputOptions: helpers.getInputOptions(
        {
          // 0: "Pending",
          1: "Accepted",
          2: "Rejected",
          3: "Resolved",
        },
        selectedOption ?? ""
      ),
      inputPlaceholder: "Select a status",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      preConfirm: async (value) => {
        if (value === "") {
          Swal.showValidationMessage("You need to select a status.");
        } else {
          Swal.showLoading();
          const status = parseInt(value, 10);
          await apiRequest(
            url || "",
            "POST",
            { new_status: status, itemid: itemId },
            callback
          );
        }
      },
    });
  };
  
  //Change User Status (block/unblock)
  const archiveUnarchiveRating = async (
    itemId?: string,
    is_archived?: boolean,
    url?: string,
    message?: string,
    callback?: () => void
  ) => {
    await Swal.fire({
      text: message,
      showCancelButton: true,
      confirmButtonText: "Submit",
      showLoaderOnConfirm: true,
      heightAuto: false, // Prevents the page from scrolling
      didOpen: helpers.didOpen,
      didClose: helpers.didClose,
      scrollbarPadding: false,
      preConfirm: async () => {
        await apiRequest(
          url || "",
          "POST",
          { is_archived: is_archived, itemid: itemId },
          callback
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return {
    changeApprovalStatus,
    changeItemStatus,
    deleteItem,
    blockUnblockUser,
    updateReportedStatus,
    blockUnblockPost,
	archiveUnarchiveRating
  };
};

export default useCommonActions;
