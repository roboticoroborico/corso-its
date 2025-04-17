"use client";
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { initialValues_Login } from "./const";
import { LoginFormValues } from "./types";
import { useRouter } from "next/navigation";
import { errorsHandlers } from "@/lib/errorsHandlers";

const LoginForm = () => {
  const [error, setError] = useState<number | null>(null);

  const theme = useMantineTheme();
  const router = useRouter();

  const form = useForm({
    initialValues: initialValues_Login,
  });

  const handleLogin = async (values: LoginFormValues) => {
    const data = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    if (data.status === 200) {
      const { redirect } = await data.json();
      router.push(redirect);
    } else {
      setError(data.status);
    }
  };

  return (
    <Paper shadow="md" p={30} mt={30} radius="md" bg={"violet.8"}>
      <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
        <TextInput
          label="Email"
          placeholder="you@mantine.dev"
          {...form.getInputProps("email")}
          styles={{
            label: {
              color: theme.colors.gray[4],
            },
          }}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          {...form.getInputProps("password")}
          styles={{
            label: {
              color: theme.colors.gray[4],
            },
          }}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Remember me"
            {...form.getInputProps("remember")}
            styles={{
              label: {
                color: theme.colors.gray[4],
              },
            }}
          />
          <Anchor component="button" size="sm" underline="always" c="white">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" type="submit">
          Sign in
        </Button>
        {error && (
          <Alert mt={20} variant="filled" color="red">
            {errorsHandlers(error)}
          </Alert>
        )}
      </form>
    </Paper>
  );
};

export default LoginForm;
