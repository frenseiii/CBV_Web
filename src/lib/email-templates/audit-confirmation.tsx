import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props { firstName?: string }

const ConfirmationEmail = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Ghost Audit, ready now</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{firstName ? `Here it is, ${firstName}.` : "Here it is."}</Heading>
        <Text style={text}>
          Your Free Ghost Audit is ready. Below you'll see exactly which clients in your last 90 days of sent emails are showing the early signals of leaving: slower replies, vaguer language, fewer questions, document requests that don't lead anywhere.
        </Text>
        <Text style={text}>
          Each client is tagged with the signals we caught and the dollar amount at risk. No guessing.
        </Text>
        <Text style={text}>If anything looks off or you want to talk through a specific client, just reply to this email.</Text>
        <Text style={signoff}>Tom<br /><span style={muted}>ClawbackVault</span></Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: ConfirmationEmail,
  subject: (d: Record<string, any>) => d?.firstName ? `${d.firstName}, your Ghost Audit is queued` : "Your Ghost Audit is queued",
  displayName: "Audit confirmation (sent immediately)",
  previewData: { firstName: "Tom" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", fontWeight: 600, color: "#0a0a0a", margin: "0 0 20px" };
const text = { fontSize: "15px", color: "#3a3a3a", lineHeight: "1.6", margin: "0 0 18px" };
const signoff = { fontSize: "15px", color: "#0a0a0a", margin: "32px 0 0" };
const muted = { color: "#888", fontSize: "13px" };
