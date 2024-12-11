import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
  export function TermsModal() {
    return (
      <Dialog>
        <DialogTrigger className="text-base hover:text-primary">
          Terms and Agreement
        </DialogTrigger>
        <DialogContent className="max-w-[800px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Terms and Agreement
            </DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] pr-4 overflow-y-auto">
            <div className="space-y-6 text-sm">
              <div className="flex flex-col ">
                <p>Last Updated: October 30, 2024</p>
                <p>Effective Date: October 30, 2024</p>
              </div>
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  1. Acceptance of Terms and Agreement
                </h2>
                <p>
                  By accessing or using Tabinet (&quot;the Software&quot;), you agree to be
                  bound by these Terms and Agreement. If you disagree with any
                  part of these terms, you do not have permission to access or use
                  the Software.
                </p>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  2. License and Usage Rights
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The Software is licensed, not sold, to you under an annual
                    Single Payment basis.
                  </li>
                  <li>
                    The License Payment fee is $60 USD per year, with potential
                    additional taxes based on your location.
                  </li>
                  <li>
                    License expires after a year of purchase, this is effective
                    immediately after the purchase whether activated or not.
                  </li>
                  <li>
                    Your Purchased License grants you a non-exclusive,
                    non-transferable right to use the Software.
                  </li>
                  <li>
                    Upon License expiry user may need to purchase a new License if
                    they want to continue use and access to the Software.
                  </li>
                  <li>
                    You have complete freedom in how you use the Software within
                    legal boundaries, but you accept full responsibility and
                    liability for your usage.
                  </li>
                </ul>
              </section>
  
              {/* Continue with other sections */}
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  3. Data Storage and Privacy
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    The Software stores all user data locally on your device.
                  </li>
                  <li>
                    We do not collect, store, or transmit any personal data except
                    what is required for license verification through Lemon
                    Squeezy.
                  </li>
                  <li>
                    We do not have access to your local data or usage patterns.
                  </li>
                  <li>
                    You are responsible for backing up any data created or stored
                    by the Software.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  4. Purchases and Payments
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Payments are processed through Lemon Squeezy.</li>
                  <li>The License purchase fee is non-refundable.</li>
                  <li>
                    Payment charges may include additional taxes based on your
                    location.
                  </li>
                  <li>
                    This is Single Payment, not a Subscription for automatic
                    renewal.
                  </li>
                  <li>
                    Your access will be terminated upon License expiration,
                    cancellation or terms violation.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">5. Privacy Policy</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Your use of the Software is also governed by our Privacy
                    Policy. Please refer to our Privacy Policy.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  6. Disclaimer of Warranties
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    THE SOFTWARE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND,
                    EXPRESS OR IMPLIED.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  7. Limitation of Liability
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    IN NO EVENT SHALL TABINET BE LIABLE FOR ANY SPECIAL,
                    INCIDENTAL, INDIRECT, OR CONSEQUENTIAL DAMAGES.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  8. Changes to Terms
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    We reserve the right to modify these terms at any time.
                    Continued use of the Software constitutes acceptance of
                    modified terms.
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">10. Governing Law</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    These Terms shall be governed by and construed in accordance
                    with the laws of our jurisdiction, the United Kingdom.
                  </li>
                </ul>
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-2">11. Feedback</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    We greatly value user feedback and are committed to improving
                    our software based on user suggestions and experiences.
                  </li>
                  <li>
                    By submitting feedback, ideas, suggestions, or comments, you:
                    <ul className="list-disc pl-5 mt-2">
                      <li>
                        Grant us the right to use such feedback without
                        restriction
                      </li>
                      <li>
                        Acknowledge that no compensation will be provided for your
                        submissions
                      </li>
                      <li>
                        Help us enhance the software for the entire user community
                      </li>
                    </ul>
                  </li>
                  <li>
                    You can submit your feedback through:
                    <ul className="list-disc pl-5 mt-2">
                      <li>Email: hello@tabinetbrowser.com</li>
                      <li>
                        GitHub Issues:
                        <a
                          href="https://github.com/JoWinner/tabinet-app/issues"
                          className="text-primary hover:underline"
                        >
                          https://github.com/JoWinner/tabinet-app/issues
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
  
              <section>
                <h2 className="text-lg font-semibold mb-2">
                  Contact Information
                </h2>
                <p>
                  For questions about these Terms, contact: hello@tabinetbrowser.com
                </p>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  