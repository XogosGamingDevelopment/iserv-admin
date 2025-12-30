import moment from "moment";

const helpers = {
  isValidEmail: (email: string): boolean => {
    email = helpers.cleanString(email);
    const regEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
    return regEmail.test(email);
  },

  isValidPhoneNo: (phone: string): boolean => {
    const regex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9]{10})+$/i;
    return phone ? regex.test(phone) : false;
  },

  isValidFormatForPassword: (password: string): string | null => {
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{8,}/;

    if (password.length === 0) {
      return "Password is empty";
    }

    const isValid =
      uppercaseRegExp.test(password) &&
      lowercaseRegExp.test(password) &&
      digitsRegExp.test(password) &&
      specialCharRegExp.test(password) &&
      minLengthRegExp.test(password);

    return isValid
      ? null
      : "Password should contain at least one uppercase, one lowercase, one digit, one special character, and minimum 8 characters.";
  },

  isValidName: (name: string): boolean => {
    name = helpers.cleanString(name);
    const namePattern = /^[a-zA-Z\s-]+$/;
    return namePattern.test(name);
  },

  splitName: (name: string = ""): { firstName: string; lastName: string } => {
    const [firstName, ...lastName] = name.split(" ").filter(Boolean);
    return {
      firstName: firstName || "",
      lastName: lastName.join(" ") || "",
    };
  },

  cleanString: (input: string): string => {
    return input.trim().replace(/\s+/g, " ");
  },

  calculateStepPercent: (total: number, current: number): string => {
    return `${(current / total) * 100}%`;
  },

  getFirstCharacter: (str: string): string => {
    if (!str) return "";
    return str.charAt(0).toUpperCase();
  },

  capitalizeFirstLetterOfEachWord: (str: string): string => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  splitAndCapitalizeFirstWord: (str: string, delimiter: string): string => {
    if (!str) return "";
    return str
      .split(delimiter)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  toTitleCase: (phrase: string): string => {
    if (!phrase) return "";
    return phrase
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },

  roleNameToString: (slug: string): string => {
    if (!slug) return "";
    //console.log('slug', slug);
    return slug
      .replace(/_/g, " ") // Replace all hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  },

  getFileType: (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    switch (extension) {
      case "pdf":
        return "pdf";
      case "doc":
      case "docx":
        return "word";
      case "xls":
      case "xlsx":
        return "excel";
      case "mp3":
      case "ogg":
      case "wav":
        return "audio";
      case "mp4":
      case "mov":
        return "video";
      case "zip":
      case "7z":
      case "rar":
        return "archive";
      case "jpg":
      case "jpeg":
      case "png":
        return "image";
      default:
        return "alt";
    }
  },

  convertDateTime: (
    datetime: Date | null | undefined,
    new_format: string
  ): string => {
    if (datetime) {
      return moment(datetime).format(new_format);
    } else {
      return "";
    }
  },

  getInputOptions: (
    options: Record<number, string>,
    selectedOption: string
  ) => {
    // Remove the currently selected option (if valid)
    const filteredOptions: Record<number, string> = {};
    Object.entries(options).forEach(([key, value]) => {
      if (value !== selectedOption) {
        filteredOptions[Number(key)] = value;
      }
    });

    return filteredOptions;
  },

  didOpen: () => {
    const content = document.querySelector("#root");
    if (content) (content as HTMLElement).style.overflow = "hidden";
  },

  didClose: () => {
    const content = document.querySelector("#root");
    if (content) (content as HTMLElement).style.overflow = "";
  },
  
  timeAgo: (created_at: Date | string): string => {
    return moment(created_at).fromNow(true);
  },
};

export default helpers;
