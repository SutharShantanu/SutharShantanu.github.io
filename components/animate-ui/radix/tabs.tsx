'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { type HTMLMotionProps, type Transition, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import {
  MotionHighlight,
  MotionHighlightItem,
} from '@/components/animate-ui/effects/motion-highlight';

const TabsOrientationContext = React.createContext<'horizontal' | 'vertical'>('horizontal');

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  orientation?: 'horizontal' | 'vertical';
};

function Tabs({ className, orientation = 'horizontal', ...props }: TabsProps) {
  return (
    <TabsOrientationContext.Provider value={orientation}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        className={cn(
          orientation === 'vertical' ? 'flex flex-col gap-4' : 'flex flex-row gap-2',
          className
        )}
        {...props}
      />
    </TabsOrientationContext.Provider>
  );
}

type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List> & {
  activeClassName?: string;
  transition?: Transition;
};

function TabsList({
  ref,
  children,
  className,
  activeClassName,
  transition = {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
  ...props
}: TabsListProps) {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

  const [activeValue, setActiveValue] = React.useState<string | undefined>(undefined);

  const getActiveValue = React.useCallback(() => {
    if (!localRef.current) return;
    const activeTab = localRef.current.querySelector<HTMLElement>('[data-state="active"]');
    if (!activeTab) return;
    setActiveValue(activeTab.getAttribute('data-value') ?? undefined);
  }, []);

  React.useEffect(() => {
    getActiveValue();
    const observer = new MutationObserver(getActiveValue);
    if (localRef.current) {
      observer.observe(localRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }
    return () => observer.disconnect();
  }, [getActiveValue]);

  const orientation = React.useContext(TabsOrientationContext);
  const isVertical = orientation === 'vertical';

  return (
    <MotionHighlight
      controlledItems
      className={cn('rounded-sm bg-background shadow-sm', activeClassName)}
      value={activeValue}
      transition={transition}
    >
      <TabsPrimitive.List
        ref={localRef}
        data-slot="tabs-list"
        className={cn(
          'bg-muted text-muted-foreground text-center',
          isVertical ? 'flex flex-col w-fit min-w-7 h-fit justify-center' : 'inline-flex h-10 w-fit',
          'items-center rounded-lg p-1',
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    </MotionHighlight>
  );
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  // Remove orientation here; will get from context
};

function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
  const orientation = React.useContext(TabsOrientationContext);
  const isVertical = orientation === 'vertical';

  return (
    <MotionHighlightItem value={value} className={isVertical ? 'w-fit' : 'size-full'}>
      <TabsPrimitive.Trigger
        data-slot="tabs-trigger"
        className={cn(
          `inline-flex cursor-pointer select-none items-center ${isVertical ? 'w-fit' : 'size-full'
          } justify-center whitespace-nowrap rounded-sm px-2 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground z-1`,
          className
        )}
        value={value}
        {...props}
      />
    </MotionHighlightItem>
  );
}

type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content> &
  HTMLMotionProps<'div'> & {
    transition?: Transition;
    orientation?: 'horizontal' | 'vertical';
  };

function TabsContent({
  className,
  children,
  // orientation = 'horizontal',
  ...props
}: TabsContentProps) {
  // You can also consume orientation here if needed
  // const orientation = React.useContext(TabsOrientationContext);

  return (
    <TabsPrimitive.Content asChild {...props}>
      <motion.div
        data-slot="tabs-content"
        className={cn('flex-1 outline-none', className)}
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    </TabsPrimitive.Content>
  );
}

type TabsContentsProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
  className?: string;
};

function TabsContents({ children, className, ...props }: TabsContentsProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const newHeight = entries?.[0]?.contentRect.height;
      if (!newHeight) return;
      requestAnimationFrame(() => {
        setHeight(newHeight);
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [children]);

  React.useLayoutEffect(() => {
    if (containerRef.current) {
      const initialHeight = containerRef.current.getBoundingClientRect().height;
      setHeight(initialHeight);
    }
  }, [children]);

  return (
    <motion.div
      data-slot="tabs-contents"
      layout
      animate={{ height }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={className}
      {...props}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsContents,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
  type TabsContentsProps,
};
