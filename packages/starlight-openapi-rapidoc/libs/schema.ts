import { z } from 'astro/zod'
import type { OpenAPIV3 } from 'openapi-types'

import { getBaseLink, stripLeadingAndTrailingSlashes } from './path'
import { getPathItemSidebarGroups, getWebhooksSidebarGroups } from './pathItem'
import { makeSidebarGroup, makeSidebarLink, type SidebarManualGroup } from './starlight'

export const SchemaConfigSchema = z.object({
  /**
   * The base path containing the generated documentation.
   * @example 'api/petstore'
   */
  base: z.string().min(1).transform(stripLeadingAndTrailingSlashes),
  /**
   * Wheter the generated documentation sidebar group should be collapsed by default.
   * @default true
   */
  collapsed: z.boolean().default(true),
  /**
   * The generated documentation sidebar group label.
   */
  label: z.string().optional(),
  /**
   * The OpenAPI/Swagger schema path or URL.
   */
  schema: z.string().min(1),

  /**
   * show badge on sidebar
   */
  showMethodBadgeSidebar: z.boolean().default(false).optional(),

  /**
   * Rapidoc props
   */
  rapidocAttrs: z.record(z.unknown()).optional(),

  /**
   * group identifier to be used in the sidebar
   */
  group: z.symbol().optional(),

  /**
   * Number of times to repeat the circular reference in the content
   */
  numberOfRepeatCircular: z.number().optional(),

  /**
   * Badge to be shown in the sidebar
   */
  badge: z
    .string()
    .optional()
    .or(
      z
        .object({
          text: z.string(),
          variant: z.enum(['note', 'danger', 'success', 'caution', 'tip', 'default']),
        })
        .optional(),
    ),
})

export function getSchemaSidebarGroups(schema: Schema): SidebarManualGroup {
  const { config, document } = schema
  const { badge, ...cleanedConfig } = config

  const cleanedSchema = {
    ...schema,
    config: cleanedConfig,
  }

  return makeSidebarGroup({
    ...config,
    items: [
      makeSidebarLink('Overview', getBaseLink(config)),
      ...getPathItemSidebarGroups(cleanedSchema),
      ...getWebhooksSidebarGroups(cleanedSchema),
    ],
    label: config.label ?? document.info.title,
  })
}

export type StarlightOpenAPISchemaConfig = z.infer<typeof SchemaConfigSchema>

export interface Schema {
  config: StarlightOpenAPISchemaConfig
  document: OpenAPIV3.Document
  documentDereferenced?: boolean
}
