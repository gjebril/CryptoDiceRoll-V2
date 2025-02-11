import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { calculateResult } from "@/lib/provablyFair";

interface ProvablyFairProps {
  clientSeed: string;
  serverSeedHash: string | null;
  lastServerSeed: string | null;
  targetValue: number;
  isOver: boolean;
}

export default function ProvablyFair({
  clientSeed,
  serverSeedHash,
  lastServerSeed,
  targetValue,
  isOver,
}: ProvablyFairProps) {
  const [verifyClientSeed, setVerifyClientSeed] = useState("");
  const [verifyServerSeed, setVerifyServerSeed] = useState("");
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!verifyClientSeed || !verifyServerSeed) {
      setVerificationResult("Please enter both client seed and server seed");
      return;
    }

    try {
      const result = await calculateResult(
        verifyClientSeed,
        verifyServerSeed,
        targetValue,
        isOver
      );

      setVerificationResult(
        `Roll: ${result.roll.toFixed(2)} - ${result.won ? "Win" : "Loss"}`
      );
    } catch (error) {
      setVerificationResult("Error verifying result");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span className="text-xs">Provably Fair</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Provably Fair</DialogTitle>
            <DialogClose>
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label>Current Client Seed</Label>
            <Input value={clientSeed} readOnly className="font-mono" />
          </div>

          <div>
            <Label>Server Seed Hash</Label>
            <Input value={serverSeedHash || ''} readOnly className="font-mono" />
          </div>

          {lastServerSeed && (
            <div>
              <Label>Last Server Seed</Label>
              <Input value={lastServerSeed} readOnly className="font-mono" />
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-4">Verify Roll</h4>

            <div className="space-y-4">
              <div>
                <Label>Client Seed</Label>
                <Input
                  value={verifyClientSeed}
                  onChange={(e) => setVerifyClientSeed(e.target.value)}
                  className="font-mono"
                  placeholder="Enter client seed to verify"
                />
              </div>

              <div>
                <Label>Server Seed</Label>
                <Input
                  value={verifyServerSeed}
                  onChange={(e) => setVerifyServerSeed(e.target.value)}
                  className="font-mono"
                  placeholder="Enter revealed server seed"
                />
              </div>

              <Button onClick={handleVerify} className="w-full">
                Verify Roll
              </Button>

              {verificationResult && (
                <div className="p-4 bg-secondary rounded-lg mt-4">
                  {verificationResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}