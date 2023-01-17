
export type VpnBotUser = {
  telegramUserId: string
  role: Role
  userSubscription?: Subscription
  userSubscriptionHistory?: SubscriptionHistory
  createdAt: Date
}

export type Role =
  | 'admin'
  | 'user'
  | 'support'

export type Subscription =
  | NoneSubscription
  | Tier1Subscription
  | Tier2Subscription

export type NoneSubscription = {
  tpe: 'NoneSubscription'
}

export type Tier1Subscription = {
  tpe: 'Tier1Subscription'
}

export type Tier2Subscription = {
  tpe: 'Tier1Subscription'
}

export type SubscriptionHistory = {
  entries: SubscriptionHistoryEntry[]
}

export type SubscriptionHistoryEntry = {
  subscription: Subscription
  timestamp: Date
}
