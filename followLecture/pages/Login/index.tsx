import customInput from '@hooks/customInput';
import React, { FormEvent, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
    Header,
    Form,
    Label,
    Input,
    Button,
    Error,
    Success,
    LinkContainer,
} from './styles';
import { getLogin, postLogin } from '@apis/Login';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IUser } from '@pages/typings/db';
import { AxiosError } from 'axios';

const Login = () => {
    const [email, , onChangeEmail] = customInput('');
    const [password, , onChangePassword] = customInput('');
    const [loginError, setLoginError] = useState(false);
    const [blankError, setBlankError] = useState({
        allBlank: '',
        emailBlank: '',
        passwordBlank: '',
    });

    const { isLoading, error, data: loginData, refetch } = useQuery(['login'], () => getLogin());
    const queryClient = useQueryClient();
    const PostLoginMutation = useMutation<IUser, AxiosError, { email: string, password: string }>('user', (data) => postLogin(data).then((response) => response.data), {
        onMutate() {
            setLoginError(false);
        },
        onSuccess: () => {
            queryClient.refetchQueries('user');
        },
        onError: (error) => {
            setLoginError(error.response?.data?.code === 401);
        }
    })
    const checkBlank = () => {
        if (!email && !password) {
            setBlankError(prev => ({ ...prev, allBlank: '빈칸을 모두 입력해주세요.' }));
            return;
        }
        !email && setBlankError(prev => ({ ...prev, emailBlank: '이메일을 입력해주세요.' }));
        !password && setBlankError(prev => ({ ...prev, passwordBlank: '비밀번호를 입력해주세요' }));
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password);
        setBlankError({
            allBlank: '',
            emailBlank: '',
            passwordBlank: '',
        });
        checkBlank();
        setLoginError(false);

        if (email && password) {
            PostLoginMutation.mutate({ email, password });
        }
    }

    if (loginData) {
        return <Navigate to='/workspace/channel' />
    }

    return (
        <div id="container">
            <Header>Sleact</Header>
            <Form onSubmit={onSubmit}>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail}></Input>
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" value={password} onChange={onChangePassword}></Input>
                    </div>
                </Label>
                {blankError.allBlank && <Error>{blankError.allBlank}</Error>}
                {blankError.emailBlank && <Error>{blankError.emailBlank}</Error>}
                {blankError.passwordBlank && <Error>{blankError.passwordBlank}</Error>}
                {loginError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
                <Button type="submit">로그인</Button>
            </Form>
            <LinkContainer>
                아직 회원이 아니신가요?&nbsp;
                <Link to="/signup">회원가입 하러가기</Link>
            </LinkContainer>
        </div>
    )
}

export default Login