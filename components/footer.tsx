import Image from "next/image";
import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TermsModal } from "./modals/terms-modal";
import { PrivacyModal } from "./modals/privacy-modal";

export const Footer = () => (
  <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="">
   <Image
  src="/images/logo.svg"
  alt="Logo"
  width={20}
  height={20}
  className="h-16 w-16"
/>
          <p className="text-sm text-muted-foreground">
          Track active users across different subreddits in real-time and time your posts!

</p>
        </div>

        {/* <div className="space-y-4">
          <h4 className="text-lg font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="https://cloud.umami.is/share/4hoAAWlkdjGJ9oD2/activereddits.com" 
              className="hover:text-primary">
                View Analytics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Changelog
              </a>
            </li>
          </ul>
        </div> */}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <PrivacyModal />
            </li>
            <li>
              <TermsModal />
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Email</h4>
          <div className="flex text-base text-muted-foreground space-x-4">
            <h1>hello@tabinetbrowser.com</h1>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Redditors Online. All rights reserved.
      </div>
    </div>
  </div>
);
