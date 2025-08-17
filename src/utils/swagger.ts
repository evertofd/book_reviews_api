
export const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "Book Reviews API",
    version: "1.0.0",
    description: "API para reseñas de libros con búsqueda en OpenLibrary y biblioteca personal",
    contact: {
      name: "Book Reviews API",
      email: "contact@bookreviews.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor de desarrollo"
    }
  ],
  paths: {
    "/api/public/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Registrar nuevo usuario",
        description: "Crear una nueva cuenta de usuario",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Usuario registrado exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          400: {
            description: "Error de validación",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    
    "/api/public/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Iniciar sesión",
        description: "Autenticar usuario y obtener token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Login exitoso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          401: {
            description: "Credenciales inválidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    
    "/api/books/search": {
      get: {
        tags: ["Books"],
        summary: "Buscar libros",
        description: "Buscar libros en OpenLibrary API",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 1, maxLength: 100 },
            description: "Título del libro a buscar",
            example: "harry potter"
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
            description: "Número máximo de resultados"
          }
        ],
        responses: {
          200: {
            description: "Búsqueda exitosa",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BookSearchResponse" }
              }
            }
          },
          401: {
            description: "Token requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    
    "/api/books/last-search": {
      get: {
        tags: ["Books"],
        summary: "Obtener historial de búsquedas",
        description: "Obtener las últimas 5 búsquedas del usuario",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Historial obtenido exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SearchHistoryResponse" }
              }
            }
          }
        }
      }
    },
    
    "/api/books/my-library": {
      post: {
        tags: ["My Library"],
        summary: "Guardar libro en mi biblioteca",
        description: "Agregar un libro a la biblioteca personal",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SaveBookRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Libro guardado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Libro guardado en tu biblioteca" },
                    book: { $ref: "#/components/schemas/SavedBook" }
                  }
                }
              }
            }
          }
        }
      },
      get: {
        tags: ["My Library"],
        summary: "Obtener mi biblioteca",
        description: "Listar libros guardados en mi biblioteca",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Biblioteca obtenida exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    books: {
                      type: "array",
                      items: { $ref: "#/components/schemas/SavedBook" }
                    },
                    total: { type: "number", example: 5 }
                  }
                }
              }
            }
          }
        }
      }
    },
    
    "/api/books/my-library/{id}": {
      get: {
        tags: ["My Library"],
        summary: "Obtener libro específico",
        description: "Obtener un libro específico de mi biblioteca",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del libro"
          }
        ],
        responses: {
          200: {
            description: "Libro encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    book: { $ref: "#/components/schemas/SavedBook" }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["My Library"],
        summary: "Actualizar review y calificación",
        description: "Actualizar el review y/o calificación de un libro",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del libro"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBookRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Libro actualizado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Libro actualizado exitosamente" },
                    book: { $ref: "#/components/schemas/SavedBook" }
                  }
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["My Library"],
        summary: "Eliminar libro de mi biblioteca",
        description: "Eliminar permanentemente un libro de mi biblioteca",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del libro"
          }
        ],
        responses: {
          200: {
            description: "Libro eliminado exitosamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Libro eliminado de tu biblioteca" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Token JWT para autenticación"
      }
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["email", "password", "alias"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", minLength: 6, example: "MyPass123!" },
          alias: { type: "string", minLength: 3, maxLength: 20, example: "BookLover" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", example: "MyPass123!" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login exitoso" },
          user: {
            type: "object",
            properties: {
              _id: { type: "string", example: "64a1b2c3d4e5f6789012345" },
              email: { type: "string", example: "user@example.com" },
              alias: { type: "string", example: "BookLover" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" }
            }
          },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
          expiresAt: { type: "string", format: "date-time" }
        }
      },
      
      BookSearchResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Se encontraron 5 libros" },
          books: {
            type: "array",
            items: { $ref: "#/components/schemas/Book" }
          },
          total: { type: "number", example: 5 },
          query: { type: "string", example: "harry potter" },
          timestamp: { type: "string", format: "date-time" }
        }
      },
      Book: {
        type: "object",
        properties: {
          title: { type: "string", example: "Harry Potter y la Piedra Filosofal" },
          author: { type: "string", example: "J.K. Rowling" },
          publishYear: { type: "string", example: "1997" },
          coverId: { type: "number", example: 12345 },
          coverUrl: { type: "string", example: "https://covers.openlibrary.org/b/id/12345-M.jpg" },
          openLibraryId: { type: "string", example: "/works/OL82563W" },
          isbn: { type: "string", example: "9780439708180" },
          inLibrary: { type: "boolean", example: false },
          hasFulltext: { type: "boolean", example: true },
          editionCount: { type: "number", example: 150 }
        }
      },
      
      SaveBookRequest: {
        type: "object",
        required: ["title", "author", "publishYear", "review", "rating"],
        properties: {
          title: { type: "string", maxLength: 200, example: "Harry Potter y la Piedra Filosofal" },
          author: { type: "string", maxLength: 100, example: "J.K. Rowling" },
          publishYear: { type: "string", example: "1997" },
          coverBase64: { type: "string", description: "Imagen en base64", example: "data:image/jpeg;base64,..." },
          review: { type: "string", minLength: 1, maxLength: 500, example: "Excelente libro, muy recomendado" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          openLibraryId: { type: "string", example: "/works/OL82563W" },
          isbn: { type: "string", example: "9780439708180" }
        }
      },
      SavedBook: {
        type: "object",
        properties: {
          _id: { type: "string", example: "64a1b2c3d4e5f6789012345" },
          userId: { type: "string", example: "64a1b2c3d4e5f6789012345" },
          title: { type: "string", example: "Harry Potter y la Piedra Filosofal" },
          author: { type: "string", example: "J.K. Rowling" },
          publishYear: { type: "string", example: "1997" },
          review: { type: "string", example: "Excelente libro, muy recomendado" },
          rating: { type: "integer", example: 5 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        }
      },
      UpdateBookRequest: {
        type: "object",
        required: ["review", "rating"],
        properties: {
          review: { type: "string", minLength: 1, maxLength: 500, example: "Review actualizado" },
          rating: { type: "integer", minimum: 1, maximum: 5, example: 4 }
        }
      },
      
      SearchHistoryResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          searches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                query: { type: "string", example: "harry potter" },
                createdAt: { type: "string", format: "date-time" }
              }
            }
          },
          total: { type: "number", example: 3 },
          user: { type: "string", example: "BookLover" }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Error message" },
          code: { type: "number", example: 400 },
          timestamp: { type: "string", format: "date-time" }
        }
      }
    }
  }
};