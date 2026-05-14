import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props { firstName?: string }

const Email = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Last note from me, closing your spot</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{firstName ? `${firstName}, last note.` : "Last note."}</Heading>
        <Text style={text}>
          I'm closing your spot in a few days. We hold the audit slot for 14 days after delivery, after that it goes to the next broker on the list.
        </Text>
        <Text style={text}>
          No pressure. If now's not the right time, that's fine. Reply with "later" and I'll set you a reminder for next quarter.
        </Text>
        <Text style={text}>
          If you want to activate, just reply "go", €99/month, 6-month money-back guarantee. If ClawbackVault doesn't pay for itself in 6 months, we refund every euro.
        </Text>
        <Text style={text}>That's it. I won't email again unless you do.</Text>
        <Text style={signoff}>Tom</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d?.firstName ? `${d.firstName}, closing your spot` : "Closing your spot",
  displayName: "Day 14, final",
  previewData: { firstName: "Tom" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", fontWeight: 600, color: "#0a0a0a", margin: "0 0 20px" };
const text = { fontSize: "15px", color: "#3a3a3a", lineHeight: "1.6", margin: "0 0 18px" };
const signoff = { fontSize: "15px", color: "#0a0a0a", margin: "32px 0 0" };
