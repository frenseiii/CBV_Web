import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props { firstName?: string }

const Email = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Quick question about your Ghost Audit</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{firstName ? `${firstName}, quick check.` : "Quick check."}</Heading>
        <Text style={text}>Did the audit land okay? I sent it over a couple of days back.</Text>
        <Text style={text}>
          Most brokers have one of three reactions:
        </Text>
        <Text style={text}>
          1. "I knew about that one.", fine, the system caught it<br />
          2. "Wait, that client?", that's the one that pays for the year<br />
          3. "I need to call these people today.", exactly
        </Text>
        <Text style={text}>Which one was it for you? Just hit reply.</Text>
        <Text style={signoff}>Tom</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d?.firstName ? `${d.firstName}, did the audit land?` : "Did the audit land?",
  displayName: "Day 2, check-in",
  previewData: { firstName: "Tom" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", fontWeight: 600, color: "#0a0a0a", margin: "0 0 20px" };
const text = { fontSize: "15px", color: "#3a3a3a", lineHeight: "1.6", margin: "0 0 18px" };
const signoff = { fontSize: "15px", color: "#0a0a0a", margin: "32px 0 0" };
