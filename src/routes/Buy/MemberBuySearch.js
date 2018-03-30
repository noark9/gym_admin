import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Row, Col, Table, Input,  Button, Select, InputNumber} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({loading, worker, member}) => ({
  submitting: loading.effects['member/addCard'],

  worker_data: worker.worker_data,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.queryWorker();
  }

  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values)
      if(!err) {

      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.query();
  }

  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.query({}, current, pageSize);
  }

  render() {
    let {submitting, form, worker_data} = this.props;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '会员号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '充值金额',
      dataIndex: 'price',
      key: 'price'
    }, {
      title: '赠送金额',
      dataIndex: 'z_price',
      key: 'z_price'
    }, {
      title: '充值顾问',
      dataIndex: 'worker_id',
      key: 'worker_id'
    }, {
      title: '充值时间',
      dataIndex: 'time',
      key: 'time'
    }, {
      title: '累计充值',
      dataIndex: 'a_price',
      key: 'a_price'
    }, {
      title: '累计赠送',
      dataIndex: 'a_z_price',
      key: 'a_z_price'
    }, {
      title: '账户余额',
      dataIndex: 'y_price',
      key: 'y_price'
    }];
    let loading = true;

    return(
      <PageHeaderLayout title="充值记录">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Row>
              <Col span="12">
                <FormItem {...f_i_l} label="搜索会员">
                  {getFieldDecorator('keyword')(
                    <Input placeholder="搜索内容" />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="充值顾问">
                  {getFieldDecorator('worker_id')(
                    <Select placeholder="教练列表"> 
                      {worker_data.list.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.worker_name}</Option>) 
                      })} 
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="充值金额">
                  <InputGroup compact>
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="账户余额">
                  <InputGroup compact>
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="累计充值">
                  <InputGroup compact>
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="20" offset="2">
                <FormItem style={{'textAlign': 'right'}}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{marginLeft: 20}} onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <div>
            <Table rowKey={record => record.id} dataSource={[]} columns={col} loading={loading} onChange={this.handleTableChange} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}