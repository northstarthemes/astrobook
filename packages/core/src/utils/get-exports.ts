import { Parser } from 'acorn'
import { tsPlugin } from '@sveltejs/acorn-typescript'

/**
 * Parses the content of the given file and returns all its exports
 */
export function getExports(code: string): string[] {
  // Parse the code into an AST
  const parser = Parser.extend(
    tsPlugin({
      dts: false,
      jsx: {
        allowNamespaces: true,
        allowNamespacedObjects: true,
      },
    }),
  )
  const ast = parser.parse(code, {
    sourceType: 'module',
    ecmaVersion: 'latest',
    allowImportExportEverywhere: true,
    locations: true,
  })

  const exports = new Set<string>()

  // Walk through the AST
  ast.body.forEach((node) => {
    if (node.type === 'ExportNamedDeclaration') {
      node.specifiers.forEach((specifier) => {
        const { exported } = specifier
        if (exported.type === 'Identifier') {
          exports.add(exported.name)
        }
      })

      const { declaration } = node
      if (declaration?.type === 'VariableDeclaration') {
        const { declarations } = declaration
        declarations.forEach((declaration) => {
          const id = declaration.id
          if (id.type === 'Identifier') {
            exports.add(id.name)
          }
        })
      }
      if (declaration?.type === 'FunctionDeclaration') {
        exports.add(declaration.id.name)
      }
      if (declaration?.type === 'ClassDeclaration') {
        exports.add(declaration.id.name)
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      exports.add('default')
    }
  })

  return Array.from(exports).sort()
}

/**
 * Extracts the slots property from the default export of a story file
 */
export function getDefaultExportSlots(code: string): string[] {
  try {
    const parser = Parser.extend(
      tsPlugin({
        dts: false,
        jsx: {
          allowNamespaces: true,
          allowNamespacedObjects: true,
        },
      }),
    )
    const ast = parser.parse(code, {
      sourceType: 'module',
      ecmaVersion: 'latest',
      allowImportExportEverywhere: true,
      locations: true,
    })

    // Find the default export
    for (const node of ast.body) {
      if (node.type === 'ExportDefaultDeclaration') {
        const declaration = node.declaration
        
        // Handle object expression
        if (declaration.type === 'ObjectExpression') {
          return extractSlotsFromObjectExpression(declaration)
        }
        
        // Handle variable reference (e.g., export default config)
        if (declaration.type === 'Identifier') {
          // Look for the variable declaration
          for (const otherNode of ast.body) {
            if (otherNode.type === 'VariableDeclaration') {
              for (const declarator of otherNode.declarations) {
                if (declarator.id.type === 'Identifier' && declarator.id.name === declaration.name) {
                  if (declarator.init?.type === 'ObjectExpression') {
                    return extractSlotsFromObjectExpression(declarator.init)
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to parse slots from default export:', error)
  }
  
  return []
}

function extractSlotsFromObjectExpression(objectExpression: any): string[] {
  for (const property of objectExpression.properties) {
    if (property.type === 'Property' && 
        property.key.type === 'Identifier' && 
        property.key.name === 'slots') {
      
      if (property.value.type === 'ArrayExpression') {
        const slots: string[] = []
        for (const element of property.value.elements) {
          if (element?.type === 'Literal' && typeof element.value === 'string') {
            slots.push(element.value)
          }
        }
        return slots
      }
    }
  }
  return []
}
