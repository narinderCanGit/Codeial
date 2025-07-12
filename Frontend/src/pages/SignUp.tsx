// src/pages/SignUp.tsx
import {
  Button,
  Container,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../slices/userApiSlice";

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormInputs>();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      await registerUser(data).unwrap(); // unwrap() to get response or throw error
      navigate("/signin");
    } catch (err: any) {
      setApiError(err?.data?.message || "Registration failed");
    }
  };

  const password = watch("password");

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            type="email"
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
          {apiError && (
            <Typography color="error" variant="body2">
              {apiError}
            </Typography>
          )}
          <Box mt={2}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
          </Box>
        </form>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            Already have an account? <a href="/signin">Sign In</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
