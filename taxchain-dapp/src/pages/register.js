import React, {Component} from "react";
import { Form, Radio, Button, Icon, Grid, Message, Tab, Statistic } from 'semantic-ui-react';
import {registerNewUser, getTaxRate, getAllEmployeeTotalIncomeList} from "../common/contractMethods";
import {connect} from "react-redux";

class Register extends Component {
    state = {
        selectedType : "employee",
        registerMessageVisible : true,
        errorMessage: "",
        doButtonLoading: false,
        totalTax : 0
    }

    async componentDidMount() {
        let salary = await getAllEmployeeTotalIncomeList(this.props.taxChainContract, this.props.userAddress);
        let taxRate = await getTaxRate(this.props.taxChainContract);
        let allSalary = salary.map(Number);
        let totalCollectedTax = (allSalary.reduce((a,b) => a+b, 0)) / taxRate;
        this.setState({
            totalTax : totalCollectedTax,
        });
    }

    handleRadioChange = (e, { value }) => this.setState({ selectedType:value })
    handleRegisterMessageDismiss = () => {
        this.setState({ registerMessageVisible: false });
    }
    getSuccessfulRegistrationMessage = () => {
        return (
        <Message success
            icon='check'
            header="You have been successfully registered"
            content=''
            size="small"
        />);
    }

    getFailedRegistrationMessage = (err) => {
        return (
            <Message negative
                    icon='times'
                    header='Sorry. Some error happened'
                    content={err.message}
                    size="small"
            />
        );
    }

    handleSubmit = async () => {
        try {
            this.setState({doButtonLoading: true});
            await registerNewUser(this.props.taxChainContract, this.props.userAddress, this.state.selectedType, this.props.userAddress);
            this.setState({
                errorMessage: this.getSuccessfulRegistrationMessage(),
                doButtonLoading: false
            })
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch(err) {
            console.log(err);
            this.setState({
                errorMessage: this.getFailedRegistrationMessage(err),
                doButtonLoading: false
            });
        }
    }

    getRegistrationPane = () => {
        let registerMessage = "";
        if(this.state.registerMessageVisible)
        {
            registerMessage =
                <Message warning
                         icon='exclamation triangle'
                         header='You are not registered in our system'
                         content='Please register to continue'
                         color="teal"
                         size="small"
                         onDismiss={this.handleRegisterMessageDismiss}
                />
        }
        let registrationPaneContent = (
            <Grid centered columns={1}>
                <Grid.Row>
                    {registerMessage}
                </Grid.Row>
                <Grid.Row>
                    {this.state.errorMessage}
                </Grid.Row>
                <Grid.Row>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Field>
                            I am an:
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Employee'
                                name='employee'
                                value='employee'
                                checked={this.state.selectedType === 'employee'}
                                onChange={this.handleRadioChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Employer'
                                name='employer'
                                value='employer'
                                checked={this.state.selectedType === 'employer'}
                                onChange={this.handleRadioChange}
                            />
                        </Form.Field>
                        <Form.Button animated loading={this.state.doButtonLoading}>
                            <Button.Content visible>Register</Button.Content>
                            <Button.Content hidden>
                                <Icon fitted size="large" name='user plus' />
                            </Button.Content>
                        </Form.Button>
                    </Form>
                </Grid.Row>
            </Grid>
        );
        let paneName = "Registration";
        return {
            menuItem: paneName,
            render: () => <Tab.Pane>{registrationPaneContent}</Tab.Pane>
        }
    }

    getTotalTaxPane = () => {
       let totalTaxPaneContent = (
           <Statistic>
               <Statistic.Label>Total Collections</Statistic.Label>
               <Statistic.Value>{this.state.totalTax}</Statistic.Value>
           </Statistic>
       );
        let paneName = "Total tax collection";
        return {
            menuItem: paneName,
            render: () => <Tab.Pane>{totalTaxPaneContent}</Tab.Pane>
        }
    }

    render() {
        let allPanes = [
            this.getRegistrationPane(),
            this.getTotalTaxPane()
        ];
        return (
            <div>
                <Tab panes={allPanes} renderActiveOnly={true} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        taxChainContract: state.taxChainContract,
        userAddress: state.userAddress,
        userType: state.userType,
    }
}
export default connect(mapStateToProps)(Register);