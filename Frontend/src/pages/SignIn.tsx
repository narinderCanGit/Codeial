// src/pages/SignIn.tsx
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {toast} from "react-toastify";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/userApiSlice";

interface SignInFormInputs {
  email: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormInputs>();

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      await login(data).unwrap();
      toast.success("Sign In successful");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Sign In failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Box mt={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            Don't have an account? <a href="/signup">Sign Up</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
