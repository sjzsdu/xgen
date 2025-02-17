import React, { useState } from 'react';
import { Button, Drawer, DrawerProps, Space } from 'antd';
import { BarsOutlined, FilterOutlined } from '@ant-design/icons';
import type { Common } from '@/types'
import styles from './index.less'
import CheckGroup from './components/checkgroup'
import { local } from '@/../storex/dist';

export interface ICustomColumn extends DrawerProps {
    columns: Array<Common.Column>
    localKey: string
    ckey: string
    musts?: string[]
    namespace: string
}

export interface ColumnItem extends Common.Column {
    selected?: boolean;
}

export interface CheckOptionItem {
  id: string,
  label: string,
  value: string,
  disabled?: boolean
}

const Index = (props: ICustomColumn ) => {
  const { columns, localKey, ckey, namespace, musts=[],  ...rest_props } = props
  const [open, setOpen] = useState(false);
  const boxRef = React.createRef<any>();

  const icons: Record<string, any> = {
    'custom_table_columns': BarsOutlined,
    'custom_filter_columns': FilterOutlined
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm = () => {
    boxRef.current.saveToLocal()
    setOpen(false);
    window.$app.Event.emit(`${namespace}/search`)
  };

  const props_drawer: DrawerProps = {
    title: 'Draw Title',
    placement: 'right',
    className: styles.custom_draw,
    ...rest_props,
  }

  let colOptions: CheckOptionItem[] = columns.map(item => {
    return {
      id: item.bind,
      label: item.name,
      value: item.bind,
      disabled: musts.includes(item.bind)
    }
  })
  const sortKey = localKey + ':sort'
  if (local[sortKey] && local[sortKey].length) {
    const opts = local[sortKey]
        .map((key: string) => colOptions.find(item => item.value === key))
        .filter((item: any) => !!item)
    const newOpts = colOptions.filter(item => !local[sortKey].includes(item.value))
    colOptions = [...opts, ...newOpts];
  }

  const [options, setOptions] = useState(colOptions)

  const props_check_column = {
    options,
    setOptions,
    localKey,
  }

  const DynamicIcon = icons[ckey] || BarsOutlined
 
  return (
    <div className='w_100'>
      <a
        className='option_item cursor_point flex justify_center align_center transition_normal clickable'
        onClick={showDrawer}
      >
        <DynamicIcon className='icon_option' style={{ fontSize: 15 }}/>
      </a>
      <Drawer 
        {...props_drawer} 
        extra={
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={onConfirm}>
              确定
            </Button>
          </Space>
        }
        onClose={onClose} 
        open={open}>
        <CheckGroup {...props_check_column} ref={boxRef}></CheckGroup>

      </Drawer>
    </div>
  );
};

export default window.$app.memo(Index)