'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PredictionType } from "@/types/prediction"

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
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"

const predictionTypes: { value: PredictionType; label: string }[] = [
  { value: "match_result", label: "Match Result" },
  { value: "over_under", label: "Over/Under" },
  { value: "both_teams_to_score", label: "Both Teams to Score" },
]

const formSchema = z.object({
  matchId: z.string().min(1, "Match is required"),
  type: z.enum(["match_result", "over_under", "both_teams_to_score"] as const),
  prediction: z.string().min(1, "Prediction is required"),
  odds: z.string().transform((val) => parseFloat(val)),
  stake: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  confidence: z.number().min(1).max(100),
  analysis: z.string().min(10, "Analysis should be at least 10 characters"),
})

type FormData = z.infer<typeof formSchema>

export function PredictionForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confidence: 50,
      type: "match_result",
    },
  })

  async function onSubmit(values: FormData) {
    try {
      setLoading(true)
      
      const response = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create prediction")
      }

      router.push("/predictions")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="matchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Match</FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a match" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Man United vs Arsenal</SelectItem>
                  <SelectItem value="2">Liverpool vs Chelsea</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prediction Type</FormLabel>
              <Select
                disabled={loading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select prediction type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {predictionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prediction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Prediction</FormLabel>
              <FormControl>
                <Input {...field} disabled={loading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="odds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odds</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stake"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stake (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="confidence"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Confidence ({value}%)</FormLabel>
              <FormControl>
                <Slider
                  {...field}
                  disabled={loading}
                  value={[value]}
                  onValueChange={(vals) => onChange(vals[0])}
                  min={1}
                  max={100}
                  step={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="analysis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Analysis</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={loading}
                  placeholder="Provide your analysis and reasoning..."
                  className="h-32"
                />
              </FormControl>
              <FormDescription>
                Include key factors that influenced your prediction
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating prediction..." : "Create Prediction"}
        </Button>
      </form>
    </Form>
  )
}