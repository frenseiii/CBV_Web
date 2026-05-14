import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

interface Props { firstName?: string }

const Email = ({ firstName }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>The three objections that kill broker tools</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{firstName ? `${firstName}, what holds people back.` : "What holds people back."}</Heading>
        <Text style={text}>I get the same three questions every week. Here are the answers, plain:</Text>
        <Text style={text}>
          <strong>"Will it send anything without my approval?"</strong> No. ClawbackVault never sends email on your behalf. It alerts you. You decide.
        </Text>
        <Text style={text}>
          <strong>"Can it see all my emails?"</strong> Only your client emails. We filter by your watchlist. Internal mail, supplier mail, personal mail, invisible to us.
        </Text>
        <Text style={text}>
          <strong>"Will my client know they're being monitored?"</strong> No. We watch your sent folder. The client sees nothing. Your relationship with them doesn't change.
        </Text>
        <Text style={text}>
          That's the entire risk surface. If those three answers work for you, we're ready when you are.
        </Text>
        <Text style={signoff}>Tom</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: (d: Record<string, any>) => d?.firstName ? `${d.firstName}, the three honest answers` : "The three honest answers",
  displayName: "Day 9, objections",
  previewData: { firstName: "Tom" },
} satisfies TemplateEntry;

const main = { backgroundColor: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px" };
const h1 = { fontSize: "22px", fontWeight: 600, color: "#0a0a0a", margin: "0 0 20px" };
const text = { fontSize: "15px", color: "#3a3a3a", lineHeight: "1.6", margin: "0 0 18px" };
const signoff = { fontSize: "15px", color: "#0a0a0a", margin: "32px 0 0" };
