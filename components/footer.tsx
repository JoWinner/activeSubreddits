import Image from "next/image";
import { GithubIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TermsModal } from "./modals/terms-modal";
import { PrivacyModal } from "./modals/privacy-modal";
import { TabinetLogo } from "./logo";

export const Footer = () => (
  <div className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="">
  {/* <h4 className="text-lg font-semibold" > Tabinet </h4> */}
  {/* <Image
  src="/images/tabinet-logo.svg"
  alt="Tabinet Logo"
  width={20}
  height={20}
  className="h-16 w-16"
/> */}
         {/* <p className="text-sm text-muted-foreground">
            Transform your browsing experience with powerful split-screen
            capabilities.
          </p>*/}
        </div>

        {/* <div className="space-y-4">
          <h4 className="text-lg font-semibold">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#" className="hover:text-primary">
                Documentation
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

        {/* <div className="space-y-4">
          <h4 className="text-lg font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <PrivacyModal />
            </li>
            <li>
              <TermsModal />
            </li>
          </ul>
        </div> */}

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Connect</h4>
          <div className="flex space-x-4">
            <a
              href="https://github.com/JoWinner/tabinetbrowser"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <GithubIcon className="h-5 w-5" />
              </Button>
            </a>
            <a 
              href="https://x.com/jowinner_" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Image
                  src="/images/x_logo.svg"
                  alt="X Logo"
                  width={20}
                  height={20}
                  className="h-6 w-6"
                />
              </Button>
            </a>
          </div>
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
