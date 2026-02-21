/**
 * PATH ALIASES CONFIGURATION
 * 
 * The following path aliases are configured and ready to use:
 * 
 * @/*             → ./src/*
 * @/components/*  → ./src/components/*
 * @/assets/*      → ./src/assets/*
 * @/lib/*         → ./src/lib/*
 * @/utils/*       → ./src/utils/*
 * @/hooks/*       → ./src/hooks/*
 * @/types/*       → ./src/types/*
 * 
 * EXAMPLE USAGE:
 * 
 * // Instead of:
 * import { Button } from '../../../components/Button'
 * import logo from '../../../assets/logo.svg'
 * 
 * // You can now write:
 * import { Button } from '@/components/Button'
 * import logo from '@/assets/logo.svg'
 * 
 * // Or use the general alias:
 * import { Button } from '@/components/Button'
 * import { cn } from '@/lib/cn'
 * import { useDebounce } from '@/hooks/useDebounce'
 * import type { User } from '@/types/user'
 */

export {};
