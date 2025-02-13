'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  initialCapital: z.string().transform((val) => parseFloat(val)).refine((val) => val > 0, {
    message: "Initial capital must be greater than 0",
  }),
  currency: z.string().default("USD"),
  maxStakePerBet: z.string().transform((val) => parseFloat(val)).refine((val) => val > 0, {
    message: "Maximum stake per bet must be greater than 0",
  }),
  maxStakePerDay: z.string().transform((val) => parseFloat(val)).refine((val) => val > 0, {
    message: "Maximum stake per day must be greater than 0",
  }),
  stakeUnit: z.enum(["fixed", "percentage"]),
  stopLoss: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  targetProfit: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
})

export function BankrollSetupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: "USD",
      stakeUnit: "fixed",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null)
      setLoading(true)

      const response = await fetch("/api/bankroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to set up bankroll")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Set Up Your Bankroll</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initialCapital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Capital</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="1000.00"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxStakePerBet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Stake Per Bet</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum amount to stake on a single bet
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStakePerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Stake Per Day</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="500.00"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum total stakes per day
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stakeUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stake Unit</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stake unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="percentage">Percentage of Bankroll</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    How stakes are calculated - fixed amounts or percentage of bankroll
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stopLoss"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Stop Loss (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="200.00"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Stop betting if losses exceed this amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetProfit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Profit Target (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="300.00"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      Stop betting when profit reaches this amount
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Set Up Bankroll
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}