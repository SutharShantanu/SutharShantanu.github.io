import * as Clipboard from "expo-clipboard";
import { Button, Card, FieldError, Input, Label, Spinner, TextField, Typography, useToast } from "heroui-native";
import { useState, type JSX } from "react";
import { View } from "react-native";
import { Icon, open, Screen } from "@/components/ui";
import { sendContact } from "@/lib/api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact(): JSX.Element {
  const { toast } = useToast();
  // The API treats submissions faster than 3 s after opening the form as bots.
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const errors = {
    name: form.name.trim().length < 2 ? "Enter your name (2+ characters)" : "",
    email: EMAIL_RE.test(form.email.trim()) ? "" : "Enter a valid email",
    subject: form.subject.trim().length < 5 ? "Subject needs 5+ characters" : "",
    message: form.message.trim().length < 10 ? "Message needs 10+ characters" : "",
  };
  const valid = !Object.values(errors).some(Boolean);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setTouched(true);
    if (!valid) return;
    setSending(true);
    try {
      const msg = await sendContact({ ...form, formStartTime: startedAt });
      toast.show({ variant: "success", label: "Message sent", description: msg });
      setForm({ name: "", email: "", subject: "", message: "" });
      setTouched(false);
      setStartedAt(Date.now());
    } catch (e) {
      toast.show({ variant: "danger", label: "Couldn't send", description: e instanceof Error ? e.message : "Try again later" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen title="Let's connect" subtitle="Upcoming project, frontend role, or just want to say hi?">
      {({ email, resumeUrl, github, profile }) => (
        <>
          <Card>
            <View className="gap-3">
              {(["name", "email", "subject"] as const).map((k) => (
                <TextField key={k} isRequired isInvalid={touched && !!errors[k]}>
                  <Label>{k === "name" ? "Your name" : k === "email" ? "Email address" : "Subject"}</Label>
                  <Input
                    placeholder={k === "name" ? "Jane Doe" : k === "email" ? "jane@company.com" : "Project proposal"}
                    value={form[k]}
                    onChangeText={set(k)}
                    autoCapitalize={k === "email" ? "none" : "sentences"}
                    keyboardType={k === "email" ? "email-address" : "default"}
                  />
                  <FieldError>{errors[k]}</FieldError>
                </TextField>
              ))}
              <TextField isRequired isInvalid={touched && !!errors.message}>
                <Label>Message</Label>
                <Input placeholder="Write your note, inquiry, or project scope…" value={form.message} onChangeText={set("message")} multiline numberOfLines={5} maxLength={1000} className="min-h-28" textAlignVertical="top" />
                <FieldError>{errors.message}</FieldError>
              </TextField>
              <Typography.Paragraph type="body-xs" color="muted">{form.message.length}/1000 characters</Typography.Paragraph>
              <Button onPress={submit} isDisabled={sending}>
                {sending ? <Spinner size="sm" /> : null}
                <Button.Label>{sending ? "Sending…" : "Send message"}</Button.Label>
              </Button>
            </View>
          </Card>

          <Card>
            <Card.Title>Reach me directly</Card.Title>
            <View className="mt-3 gap-2">
              <Button
                variant="secondary"
                onPress={async () => {
                  await Clipboard.setStringAsync(email);
                  toast.show({ variant: "success", label: "Email copied", description: email });
                }}
              >
                <Icon name="copy-outline" size={14} />
                <Button.Label>{email}</Button.Label>
              </Button>
              <View className="flex-row gap-2">
                <Button variant="outline" className="flex-1" onPress={() => open(`mailto:${email}`)}>
                  <Button.Label>Mail app</Button.Label>
                </Button>
                <Button variant="outline" className="flex-1" onPress={() => open(resumeUrl)}>
                  <Button.Label>Résumé</Button.Label>
                </Button>
              </View>
              <View className="flex-row gap-2">
                <Button variant="ghost" className="flex-1" onPress={() => open(github.url)}>
                  <Icon name="logo-github" size={14} />
                  <Button.Label>GitHub</Button.Label>
                </Button>
                <Button variant="ghost" className="flex-1" onPress={() => open(profile.linkedinUrl)}>
                  <Icon name="logo-linkedin" size={14} />
                  <Button.Label>LinkedIn</Button.Label>
                </Button>
              </View>
            </View>
          </Card>
        </>
      )}
    </Screen>
  );
}
