'use client';

import { Flex, Input, Text, IconButton } from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { FiEdit3, FiCheck } from 'react-icons/fi';

interface PlanNameEditorProps {
  initialName: string | null;
  onSave: (newName: string) => void;
}

export default function PlanNameEditor({ initialName, onSave }: PlanNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState<string | null>(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!tempName) return;
    const trimmed = tempName.trim();
    if (trimmed && trimmed !== initialName) {
      onSave(trimmed);
    }
    setIsEditing(false);
  };

  return (
    <Flex align="center" onClick={e => e.stopPropagation()}>
      {isEditing ? (
        <>
          <Input
            ref={inputRef}
            value={tempName || ''}
            onChange={e => setTempName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSave();
            }}
            size="sm"
            variant="flushed"
            autoFocus
            maxW="300px"
          />
          <IconButton aria-label="저장" size="sm" variant="ghost" onClick={handleSave}>
            <FiCheck />
          </IconButton>
        </>
      ) : (
        <>
          <Text fontWeight="semibold" fontSize="lg" truncate>
            {initialName || '일정 제목 없음'}
          </Text>
          <IconButton
            aria-label="제목 수정"
            size="xs"
            variant="ghost"
            onClick={() => {
              setIsEditing(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}>
            <FiEdit3 />
          </IconButton>
        </>
      )}
    </Flex>
  );
}
