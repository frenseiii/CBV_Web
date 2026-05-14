import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props { firstName?: string }

const Email = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>The maths on a single save</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{firstName ? `${firstName}, the maths.` : "The maths."}</Heading>
        <Text style={text}>One save covers 49 months of ClawbackVault.</Text>
        <Text style={text}>
          Average UK mortgage clawback: ~€2,400. ClawbackVault is €99/month. So if it catches one client switching in the next four years, the system has paid for itself four times over.
        </Text>
        <Text style={text}>
          And here's the part most brokers don't realise, the audit you got is the install. The OAuth connection is already there. Going live is one click. We start watching from day one.
        </Text>
        <Text style={text}>
          7-day shadow mode: we watch in read-only for a week. If we catch a real signal, we send you one live alert. No obligation. If it doesn't happen, you walk away, no charge.
        </Text>
        <Text style={text}>Want me to flip it on? Just reply "yes" and I'll do it from my end.</Text>
        <Text style={signoff}>Tom</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d?.firstName ? `${d.firstName}, one save = 49 months` : "One save = 49 months",
  displayName: "Day 5, the maths",
  previewData: { firstName: "Tom" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", fontWeight: 600, color: "#0a0a0a", margin: "0 0 20px" };
const text = { fontSize: "15px", color: "#3a3a3a", lineHeight: "1.6", margin: "0 0 18px" };
const signoff = { fontSize: "15px", color: "#0a0a0a", margin: "32px 0 0" };
