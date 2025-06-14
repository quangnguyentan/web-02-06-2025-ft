import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import registerImg from "@/assets/admin/register.svg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { GoDotFill } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import facebook from "@/assets/admin/facebook.png";
import google from "@/assets/admin/google.webp";
import toast from "react-hot-toast";
import { apiRegister } from "@/services/auth.services";
import { authActionProps } from "@/stores/actions/authAction";
import icon_auth from "@/assets/user/icon-auth.jpeg";
type registerProps = {
  onLogin?: () => void;
  onShowPassword?: boolean;
  onTogglePassword?: () => void;
  onClickTypeLogin: (type: string) => void;
};
const Register = ({
  onLogin,
  onShowPassword,
  onTogglePassword,
  onClickTypeLogin,
}: registerProps) => {
  const [showIndicator, setShowIndicator] = useState(false);

  const [passLetter, setPassLetter] = useState(false);
  const [passNumber, setPassNumber] = useState(false);
  const [passChar, setPassChar] = useState(false);
  const [passLength, setPassLength] = useState(false);

  const [passComplete, setPassComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState<authActionProps>({
    username: "",
    email: "",
    password: "",
  });
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!input.email || !input.password) {
        toast.error("Please fill in all fields");
        return;
      }
      setLoading(true);
      const response = await apiRegister({
        ...input,
        typeLogin: "email",
      });
      if (response.data.err == 0) {
        toast.error(response.data.msg);
      }
      if (response.data.success) {
        toast.success("Register successful!");
        onLogin?.();
        setInput({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  const handleShowIndicator = () => {
    setShowIndicator(true);
  };

  useEffect(() => {
    // check Lower and Uppercase
    if (input.password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setPassLetter(true);
    } else {
      setPassLetter(false);
    }

    // Check For Numbers
    if (input.password.match(/([0-9])/)) {
      setPassNumber(true);
    } else {
      setPassNumber(false);
    }

    // Check For Special char

    if (input.password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setPassChar(true);
    } else {
      setPassChar(false);
    }

    if (input.password.length > 7) {
      setPassLength(true);
    } else {
      setPassLength(false);
    }

    if (passLetter && passNumber && passChar && passLength) {
      setPassComplete(true);
    } else {
      setPassComplete(false);
    }
  }, [input.password, passLetter, passNumber, passChar, passLength]);

  return (
    <>
      <div className="main-container --flex-center">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="--form-control">
            <h2 className="--color-dark --text-center font-bold">Register</h2>
            <span className="font-normal text-gray-500/80 text-[18px] flex items-center justify-center">
              Welcome to Speak-Up!
            </span>
            {/* <input type="text" className="--width-100" placeholder="Username" /> */}
            <input
              onChange={handleInput}
              name="username"
              type="text"
              className="--width-100 !rounded-xl"
              placeholder="Fullname"
            />
            <input
              onChange={handleInput}
              name="email"
              type="email"
              className="--width-100 !rounded-xl"
              placeholder="Email"
            />
            {/* PASSWORD FIELD */}
            <div className="password">
              <input
                type={onShowPassword ? "text" : "password"}
                className="--width-100 !rounded-xl"
                name="password"
                placeholder="Password"
                onFocus={handleShowIndicator}
                value={input.password}
                onChange={handleInput}
              />
              <span
                className="icon"
                data-testid="toggle-password-icon"
                onClick={onTogglePassword}
              >
                {onShowPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            {/* PASSWORD FIELD */}
            <button
              disabled={!passComplete}
              className={
                passComplete
                  ? "--btn --btn-dark hover:bg-black/90 hover:text-gray-300/90 --btn-block"
                  : "--btn --btn-dark hover:bg-black/90 hover:text-gray-300/90 --btn-block btn-disabled"
              }
            >
              Register
            </button>

            <span className="--text-sm --block">
              Have an account?
              <a className="--text-sm cursor-pointer" onClick={onLogin}>
                Login
              </a>
            </span>
            <div className="flex items-center justify-center gap-4 pt-4">
              <img
                className="h-14 w-14 object-cover cursor-pointer"
                src={facebook}
                alt="facebook"
                onClick={() => onClickTypeLogin("facebook")}
              />
              <img
                className="h-14 w-14 object-cover cursor-pointer"
                src={google}
                alt="google"
                onClick={() => onClickTypeLogin("google")}
              />
            </div>
            {/* Pass Strength Indicator */}
            <div
              className={showIndicator ? "show-indicator" : "hide-indicator"}
            >
              <ul className="--list-style-none --card --bg-grey --text-sm --p">
                <p className="--text-sm">Password Strength Indicator</p>
                <li className={passLetter ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passLetter ? <FaCheck /> : <GoDotFill />}
                    &nbsp; Lowercase & Uppercase
                  </span>
                </li>
                <li className={passNumber ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passNumber ? <FaCheck /> : <GoDotFill />}
                    &nbsp; Numbers (0-9)
                  </span>
                </li>
                <li className={passChar ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passChar ? <FaCheck /> : <GoDotFill />}
                    &nbsp; Special Character (!@#$%^&*)
                  </span>
                </li>
                <li className={passLength ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passLength ? <FaCheck /> : <GoDotFill />}
                    &nbsp; At least 8 Character
                  </span>
                </li>
              </ul>
            </div>
            {/* Pass Strength Indicator */}
          </form>
        </div>
        {/* <div className="img-container-auth flex items-center justify-center ">
          <img
            src={icon_auth}
            alt="login"
            className="w-[70%] h-[90%] object-cover mx-auto -rotate-6 rounded-3xl"
          />
        </div> */}
        <div className="img-container">
          <img src={registerImg} alt="login" />
        </div>
      </div>

      {/* <div className="main-container --flex-center">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="--form-control">
            <h2 className="--color-danger --text-center">Register</h2>

            <input
              onChange={handleInput}
              name="email"
              type="email"
              className="--width-100"
              placeholder="Email"
            />
            <div className="password">
              <input
                type={onShowPassword ? "text" : "password"}
                className="--width-100"
                name="password"
                placeholder="Password"
                onFocus={handleShowIndicator}
                value={input.password}
                onChange={handleInput}
              />
              <span className="icon" onClick={onTogglePassword}>
                {onShowPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <button
              disabled={!passComplete}
              className={
                passComplete
                  ? "--btn --btn-primary --btn-block"
                  : "--btn --btn-primary --btn-block btn-disabled"
              }
            >
              Register
            </button>

            <span className="--text-sm --block">
              Have an account?
              <a className="--text-sm" onClick={onLogin}>
                Login
              </a>
            </span>
            <div className="flex items-center justify-center gap-4 pt-4">
              <img
                className="h-14 w-14 object-cover cursor-pointer"
                src={facebook}
                alt="facebook"
                onClick={() => onClickTypeLogin("facebook")}
              />
              <img
                className="h-14 w-14 object-cover cursor-pointer"
                src={google}
                alt="google"
                onClick={() => onClickTypeLogin("google")}
              />
            </div>
            <div
              className={showIndicator ? "show-indicator" : "hide-indicator"}
            >
              <ul className="--list-style-none --card --bg-grey --text-sm --p">
                <p className="--text-sm">Password Strength Indicator</p>
                <li className={passLetter ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passLetter ? <FaCheck /> : <GoDotFill />}
                    &nbsp; Lowercase & Uppercase
                  </span>
                </li>
                <li className={passNumber ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passNumber ? <FaCheck /> : <GoDotFill />}
                    &nbsp; Numbers (0-9)
                  </span>
                </li>
                <li className={passChar ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passChar ? <FaCheck /> : <GoDotFill />}
                    &nbsp; Special Character (!@#$%^&*)
                  </span>
                </li>
                <li className={passLength ? "pass-green" : "pass-red"}>
                  <span className="--align-center">
                    {passLength ? <FaCheck /> : <GoDotFill />}
                    &nbsp; At least 8 Character
                  </span>
                </li>
              </ul>
            </div>
          </form>
        </div>
        <div className="img-container">
          <img src={registerImg} alt="login" />
        </div>
      </div> */}
    </>
  );
};

export default Register;
