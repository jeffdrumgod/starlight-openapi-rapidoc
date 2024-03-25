import { getOperationsByTag, getWebhooksOperations } from './operation'
import { getBaseLink } from './path'
import type { Schema } from './schema'
import { makeSidebarGroup, makeSidebarLinkFromPathOperation, type SidebarManualGroup } from './starlight'

export function getPathItemSidebarGroups({ config, document }: Schema): SidebarManualGroup['items'] {
  const baseLink = getBaseLink(config)
  const { showMethodBadgeSidebar } = config
  const operations = getOperationsByTag(document)

  return [...operations.entries()].map(([tag, operations]) =>
    makeSidebarGroup({
      ...config,
      label: tag,
      items: operations.map((operation) =>
        makeSidebarLinkFromPathOperation(operation, { baseLink, showMethodBadgeSidebar }),
      ),
    }),
  )
}

export function getWebhooksSidebarGroups({ config, document }: Schema): SidebarManualGroup['items'] {
  const baseLink = getBaseLink(config)
  const operations = getWebhooksOperations(document)

  if (operations.length === 0) {
    return []
  }

  return [
    makeSidebarGroup({
      ...config,
      label: 'Webhooks',
      items: operations.map((operation) => makeSidebarLinkFromPathOperation(operation, { baseLink })),
    }),
  ]
}

export function isPathItem(pathItem: unknown): pathItem is PathItem {
  return typeof pathItem === 'object'
}

type Paths = NonNullable<Schema['document']['paths']>
export type PathItem = NonNullable<Paths[string]>
