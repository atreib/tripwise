import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const termsContent = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Tripwise, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.",
      "We reserve the right to update or change our Terms of Service at any time without prior notice. Your continued use of the service after we post any modifications to the Terms of Service on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms of Service.",
    ],
  },
  {
    title: "Use of Service",
    content: [
      "You must be at least 18 years old to use this service.",
      "You are responsible for maintaining the confidentiality of your account and password.",
      "You agree to accept responsibility for all activities that occur under your account.",
      "You must not use Tripwise for any illegal or unauthorized purpose.",
      "You must not transmit any worms or viruses or any code of a destructive nature.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "The service and its original content, features, and functionality are owned by Tripwise and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.",
      "You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without express written permission by us.",
    ],
  },
  {
    title: "User-Generated Content",
    content: [
      "You retain your rights to any content you submit, post or display on or through Tripwise.",
      "By posting content to Tripwise, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in any media.",
      "You represent and warrant that you own or control all rights in and to the content you post, and that use of your content does not violate these Terms of Service or any applicable laws.",
    ],
  },
  {
    title: "Termination",
    content: [
      "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.",
      "If you wish to terminate your account, you may simply discontinue using the Service.",
      "All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "In no event shall Tripwise, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.",
    ],
  },
  {
    title: "Governing Law",
    content: [
      "These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.",
      "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              Terms of Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Last Updated: 15 November 2024
            </p>
            <p className="mt-4">
              Welcome to Tripwise. By using our service, you agree to these
              Terms of Service. Please read them carefully.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          {termsContent.map((section, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{section.title}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex}>{paragraph}</p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:tripwise@andretreib.com"
                className="text-primary hover:underline"
              >
                tripwise@andretreib.com
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
