import { Link } from "react-router"
import { useOnLoginSubmitMutation, SignInRequest } from "@/features/auth/queries/useSignIn"
import { useForm, SubmitHandler } from "react-hook-form"

function SignIn() {
  const {
    register,
    handleSubmit,
    // formState: { errors: formErrors },
  } = useForm<SignInRequest>()
  
  const { mutate: loginSubmit,
     data: loginResponse,
    //  isLoading,
    //  isError,
    //  isSuccess,
    //  error
    } = useOnLoginSubmitMutation({
      // onSuccess: (data, variables, context) => {
      //   // navigate('/app');
      //   console.log(headers.getSetCookie())
      // }
     });

    //  console.log(formErrors);

  const submitForm: SubmitHandler<SignInRequest> = ({email, password}) =>{
      loginSubmit({email, password})
      console.log(loginResponse);
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-light">Sign in to HarperDB Studio</h1>
      <form onSubmit={handleSubmit(submitForm)}>
        <div className="py-4">
        <label className="block pb-2 text-sm" htmlFor="email">
        Email
        </label>
        <input 
          id="email"
          {...register("email", { required: true })}
          type="email"
          placeholder="jane.doe@harperdb.io"
        />
        </div>
        <div>
        <label className="block pb-2 text-sm" htmlFor="password">
        Password
        </label>
        <input 
          id="password"
          {...register("password", { required: true })}
          type="password" 
          placeholder="password" 
        />
        </div>
        <button type="submit" className="w-full py-2 mt-6 text-sm rounded-full blue-gradient">Sign In</button>
      </form>
      <div className="flex px-4 mt-4 underline place-content-between">
        <Link className="text-sm" to="/sign-up">Sign up for free</Link>
        <Link className="text-sm" to="/reset-password">Reset password</Link>
      </div>
    </div>
  )
}

export default SignIn
