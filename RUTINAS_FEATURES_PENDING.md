# FUNCIONALIDADES PENDIENTES - MÓDULO DE RUTINAS

## Resumen
El sistema ya tiene la estructura base de rutinas implementada con modelos en Prisma, pero faltan varias funcionalidades críticas solicitadas.

## ✅ COMPLETADO

### 1. Botón RUTINAS en Home Page
- ✅ Agregado botón "Rutinas" en el home page (línea 15 de src/app/page.tsx)
- ✅ Con ícono Dumbbell y color naranja (bg-orange-500)
- ✅ Enlace a /routines

### 2. Modelos de Base de Datos
- ✅ Equipment: Modelo con categorías (DUMBBELL, BARBELL, KETTLEBELL, etc.)
- ✅ Exercise: Modelo con muscleGroup, equipmentId, usesWeight
- ✅ Routine: Modelo principal de rutinas
- ✅ RoutineExercise: Relación rutina-ejercicios
- ✅ MemberRoutine: Asignación de rutinas a miembros
- ✅ TrainingSession: Sesiones de entrenamiento
- ✅ SessionExerciseLog: Log detallado de ejercicios por sesión

## ❌ PENDIENTE DE IMPLEMENTACIÓN

### 3. Filtros de Ejercicios en Crear Rutina
**Ubicación:** `src/app/routines/new/page.tsx`

**Funcionalidad requerida:**
```typescript
// Agregar estados para filtros:
const [equipmentFilter, setEquipmentFilter] = useState<string>('')
const [muscleGroupFilter, setMuscleGroupFilter] = useState<string>('')
const [searchFilter, setSearchFilter] = useState<string>('')

// Filtrar ejercicios disponibles:
const filteredExercises = availableExercises.filter(exercise => {
  if (equipmentFilter && exercise.equipment?.category !== equipmentFilter) return false
  if (muscleGroupFilter && exercise.muscleGroup !== muscleGroupFilter) return false
  if (searchFilter && !exercise.name.toLowerCase().includes(searchFilter.toLowerCase())) return false
  return true
})
```

**UI Components necesarios:**
- Select para Equipment Category (BODYWEIGHT, DUMBBELL, BARBELL, KETTLEBELL, etc.)
- Select para Muscle Group (CHEST, BACK, SHOULDERS, ARMS, CORE, LEGS, GLUTES, FULL_BODY, CARDIO)
- Input de búsqueda por nombre de ejercicio

### 4. Asignación Obligatoria a Miembro
**Ubicación:** `src/app/routines/new/page.tsx`

**Funcionalidad requerida:**
```typescript
// 1. Agregar estado para miembro seleccionado:
const [selectedMemberId, setSelectedMemberId] = useState<string>('')

// 2. Fetch de miembros activos:
const [members, setMembers] = useState<Member[]>([])

useEffect(() => {
  fetch('/api/members?active=true')
    .then(res => res.json())
    .then(data => setMembers(data))
}, [])

// 3. Validar antes de crear rutina:
const handleSubmit = async () => {
  if (!selectedMemberId) {
    toast.error('Debe seleccionar un miembro para asignar la rutina')
    return
  }
  // ... resto del código
}

// 4. Incluir en el POST a API:
const response = await fetch('/api/routines', {
  method: 'POST',
  body: JSON.stringify({
    ...formData,
    exercises,
    memberId: selectedMemberId // IMPORTANTE
  })
})
```

**UI Component necesario:**
- Select/Combobox para seleccionar miembro (obligatorio)
- Mostrar nombre, email o ID del miembro
- Validación visual si no se selecciona

### 5. API Route para Crear Rutina con Asignación
**Ubicación:** `src/app/api/routines/route.ts`

**Modificaciones necesarias:**
```typescript
export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, difficulty, duration, isActive, exercises, memberId } = body

  // Validar memberId
  if (!memberId) {
    return NextResponse.json(
      { error: 'memberId is required' },
      { status: 400 }
    )
  }

  // Crear rutina Y asignación en una transacción:
  const result = await prisma.$transaction(async (tx) => {
    // 1. Crear rutina
    const routine = await tx.routine.create({
      data: {
        name,
        description,
        difficulty,
        duration,
        isActive,
      }
    })

    // 2. Agregar ejercicios
    if (exercises?.length) {
      await tx.routineExercise.createMany({
        data: exercises.map((ex: any) => ({
          routineId: routine.id,
          exerciseId: ex.id,
          sets: ex.sets,
          reps: ex.reps,
          restSeconds: ex.restSeconds,
          notes: ex.notes
        }))
      })
    }

    // 3. IMPORTANTE: Crear asignación a miembro
    await tx.memberRoutine.create({
      data: {
        memberId,
        routineId: routine.id
      }
    })

    return routine
  })

  return NextResponse.json(result)
}
```

### 6. Registro de Entrenamientos Diarios
**Ubicación:** Crear `src/app/training-sessions/new/page.tsx`

**Funcionalidad completa:**
```typescript
// Página para iniciar sesión de entrenamiento
// 1. Seleccionar miembro
// 2. Seleccionar rutina asignada a ese miembro
// 3. Por cada ejercicio de la rutina:
//    - Registrar sets completados
//    - Registrar reps por set
//    - Registrar peso usado (si aplica)
//    - Notas opcionales
// 4. Calcular duración total
// 5. Guardar TrainingSession + SessionExerciseLog

const handleCompleteSession = async () => {
  const session = await fetch('/api/training-sessions', {
    method: 'POST',
    body: JSON.stringify({
      memberRoutineId: selectedMemberRoutine.id,
      sessionDate: new Date(),
      durationMinutes: actualDuration,
      completed: true,
      notes: sessionNotes,
      exerciseLogs: exerciseLogs.map(log => ({
        exerciseId: log.exerciseId,
        setNumber: log.setNumber,
        reps: log.reps,
        weight: log.weight,
        weightUnit: log.weightUnit,
        notes: log.notes
      }))
    })
  })
}
```

**API Route necesario:**
`src/app/api/training-sessions/route.ts`

```typescript
export async function POST(request: Request) {
  const { memberRoutineId, sessionDate, durationMinutes, completed, notes, exerciseLogs } = await request.json()

  const result = await prisma.$transaction(async (tx) => {
    // Crear sesión
    const session = await tx.trainingSession.create({
      data: {
        memberRoutineId,
        sessionDate,
        durationMinutes,
        completed,
        notes
      }
    })

    // Crear logs de ejercicios
    if (exerciseLogs?.length) {
      await tx.sessionExerciseLog.createMany({
        data: exerciseLogs.map(log => ({
          sessionId: session.id,
          exerciseId: log.exerciseId,
          setNumber: log.setNumber,
          reps: log.reps,
          weight: log.weight,
          weightUnit: log.weightUnit || 'KG',
          notes: log.notes
        }))
      })
    }

    return session
  })

  return NextResponse.json(result)
}
```

## ARCHIVOS A MODIFICAR/CREAR

### Modificar:
1. ✅ `src/app/page.tsx` - Agregar botón Rutinas (COMPLETADO)
2. ❌ `src/app/routines/new/page.tsx` - Agregar filtros y selección de miembro
3. ❌ `src/app/api/routines/route.ts` - Incluir creación de MemberRoutine

### Crear:
1. ❌ `src/app/training-sessions/new/page.tsx` - Página para registrar entrenamientos
2. ❌ `src/app/training-sessions/page.tsx` - Lista de sesiones de entrenamiento
3. ❌ `src/app/api/training-sessions/route.ts` - API para crear sesiones
4. ❌ `src/app/api/members/[id]/routines/route.ts` - API para obtener rutinas de un miembro

## PRIORIDADES

1. **ALTA:** Filtros de ejercicios (equipamiento, grupo muscular, búsqueda)
2. **ALTA:** Asignación obligatoria a miembro en crear rutina
3. **ALTA:** Modificar API de rutinas para crear MemberRoutine
4. **MEDIA:** Página de registro de entrenamientos diarios
5. **MEDIA:** API de training sessions
6. **BAJA:** Dashboard de progreso de entrenamientos

## NOTAS TÉCNICAS

- El schema de Prisma ya está completo y correcto
- Los enums están bien definidos (EquipmentCategory, MuscleGroup, WeightUnit)
- La relación Member -> MemberRoutine -> Routine -> TrainingSession existe
- Solo falta implementar la UI y la lógica de negocio
