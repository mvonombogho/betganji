'use client'

import { useEffect, useRef } from 'react'
import { Match, Commentary } from "@/types/match"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Scroll, Goal, Card as CardIcon, UserPlus2 } from "lucide-react"

interface MatchCommentaryProps {
  match: Match
}

function CommentaryIcon({ type }: { type: Commentary['type'] }) {
  switch (type) {
    case 'goal':
      return <Goal className="h-4 w-4 text-green-500" />
    case 'card':
      return <CardIcon className="h-4 w-4 text-yellow-500" />
    case 'substitution':
      return <UserPlus2 className="h-4 w-4 text-blue-500" />
    default:
      return <Scroll className="h-4 w-4 text-gray-500" />
  }
}

function CommentaryMessage({ comment }: { comment: Commentary }) {
  const getFormattedMessage = () => {
    switch (comment.type) {
      case 'goal':
        return (
          <div>
            <span className="font-medium">GOAL! </span>
            {comment.message}
            {comment.relatedPlayers?.scorer && (
              <span className="text-green-500">
                ⚽ {comment.relatedPlayers.scorer.name}
                {comment.relatedPlayers.assist && (
                  <span className="text-muted-foreground">
                    {' '}(assist by {comment.relatedPlayers.assist.name})
                  </span>
                )}
              </span>
            )}
          </div>
        )
      case 'substitution':
        return (
          <div>
            <span className="font-medium">Substitution: </span>
            {comment.relatedPlayers?.playerIn && comment.relatedPlayers?.playerOut && (
              <span>
                ↑ <span className="text-green-500">{comment.relatedPlayers.playerIn.name}</span>
                {' '}replaces{' '}
                ↓ <span className="text-red-500">{comment.relatedPlayers.playerOut.name}</span>
              </span>
            )}
          </div>
        )
      default:
        return comment.message
    }
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
        <CommentaryIcon type={comment.type} />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold">{comment.minute}'</span>
          <span className="text-sm text-muted-foreground">
            {new Date(comment.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <p className="mt-1">{getFormattedMessage()}</p>
      </div>
    </div>
  )
}

export function MatchCommentary({ match }: MatchCommentaryProps) {
  const commentaryRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new comments are added
  useEffect(() => {
    if (commentaryRef.current) {
      commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight
    }
  }, [match.commentary?.length])

  if (!match.commentary?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Commentary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No commentary available yet
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Commentary</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={commentaryRef}
          className="space-y-4 max-h-[500px] overflow-y-auto pr-4"
        >
          {[...match.commentary].reverse().map((comment) => (
            <CommentaryMessage key={comment.id} comment={comment} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}