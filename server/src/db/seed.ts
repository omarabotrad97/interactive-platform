import { db } from './index';
import { users, courses, lessons, quizzes, questions, flashcards } from './schema';
import bcrypt from 'bcrypt';

async function main() {
    console.log('Seeding database...');

    // 1. Create a Teacher User
    const teacherPasswordHash = await bcrypt.hash('teacher123', 10);
    const insertedTeachers = await db.insert(users).values({
        name: 'بيت الحكمة (المنشئ)',
        email: 'teacher@houseofwisdom.com',
        password: teacherPasswordHash,
        role: 'teacher',
        xp: 500,
        level: 5,
        badges: [
            { key: 'first_step', name: 'الخطوة الأولى', description: 'أكملت أول درس لك بنجاح' }
        ]
    }).returning({ id: users.id });

    const teacherId = insertedTeachers[0].id;
    console.log(`Created teacher with ID: ${teacherId}`);

    // 2. Create Course 1: AI & Spaced Repetition (بيت الحكمة)
    const insertedCourses = await db.insert(courses).values([
        {
            title: 'أساسيات الذكاء الاصطناعي والشبكات العصبية',
            description: 'تعرف على أسس تدريب النماذج الرياضية، وتمرير الخطأ الخلفي بأسلوب تفاعلي حديث مع مؤقت التركيز وبطاقات التكرار المتباعد.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
            teacherId: teacherId,
            published: true,
        },
        {
            title: 'بناء واجهات الويب التفاعلية الحديثة',
            description: 'أتقن مهارات الويب الحديثة، إدارة الحالة باستخدام Zustand وتصميم واجهات متطابقة مع الوضع المظلم والمضيء.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80',
            teacherId: teacherId,
            published: true,
        }
    ]).returning({ id: courses.id });

    const course1Id = insertedCourses[0].id;
    const course2Id = insertedCourses[1].id;
    console.log(`Created courses: ${course1Id}, ${course2Id}`);

    // 3. Create Lessons for Course 1
    const insertedLessonsC1 = await db.insert(lessons).values([
        {
            courseId: course1Id,
            title: 'المفهوم الأساسي للذكاء الاصطناعي وتاريخ الخوارزميات',
            content: 'الذكاء الاصطناعي يعتمد على محاكاة طريقة التفكير البشري عبر إيجاد الأنماط في البيانات الرياضية المعقدة. تعود الجذور إلى الخوارزميات الجبرية التي أطلقها الخوارزمي في بيت الحكمة في بغداد لتسهيل العمليات الحسابية المتكررة.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            order: 1,
        },
        {
            courseId: course1Id,
            title: 'كيف تتعلم الخلايا العصبية؟ وتمرير الخطأ الخلفي (Backpropagation)',
            content: 'تعتمد الشبكات العصبية على أوزان (Weights) وانحيازات (Biases) لتعديل قيم المخرجات. عملية الـ Backpropagation تقوم بحساب المشتقات لتحديث هذه المعاملات بالاتجاه المعاكس لتقليل نسبة الخطأ.',
            videoUrl: 'https://www.w3schools.com/html/movie.mp4',
            order: 2,
        }
    ]).returning({ id: lessons.id });

    const lesson1Id = insertedLessonsC1[0].id;
    const lesson2Id = insertedLessonsC1[1].id;
    console.log(`Created lessons for Course 1: ${lesson1Id}, ${lesson2Id}`);

    // 4. Create Lessons for Course 2
    const insertedLessonsC2 = await db.insert(lessons).values([
        {
            courseId: course2Id,
            title: 'مقدمة في إدارة الحالة و Zustand المتقدم',
            content: 'توفر Zustand طريقة سهلة ومختصرة لإدارة الحالة في React دون الحاجة لتعقيدات Redux. سنشرح كيفية كتابة المخزن (Store) وربطه مع LocalStorage واستدعاء API خارجي.',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            order: 1,
        }
    ]).returning({ id: lessons.id });

    console.log(`Created lessons for Course 2`);

    // 5. Create Quizzes & Questions for Course 1 Lesson 2
    const insertedQuizzes = await db.insert(quizzes).values([
        {
            lessonId: lesson2Id,
            courseId: course1Id,
            title: 'اختبار تفاعلي: فهم تمرير الخطأ الخلفي',
        }
    ]).returning({ id: quizzes.id });

    const quizId = insertedQuizzes[0].id;

    await db.insert(questions).values([
        {
            quizId: quizId,
            text: 'ما هو الهدف الأساسي من عملية التمرير الخلفي للأخطاء (Backpropagation)؟',
            options: [
                'حذف الأوزان غير المستخدمة تلقائياً',
                'تحديث أوزان وانحيازات الشبكة لتقليل قيمة دالة الخسارة',
                'زيادة سرعة معالجة الفيديو في الخادم'
            ],
            correctAnswer: 1, // Option Index 1 (Second option)
        },
        {
            quizId: quizId,
            text: 'أي عالم يعتبر مؤسس علم الجبر والخوارزميات التي تبنى عليها الحواسيب الحديثة؟',
            options: [
                'ابن سينا',
                'الفارابي',
                'الخوارزمي'
            ],
            correctAnswer: 2, // Option Index 2 (Third option)
        }
    ]);
    console.log('Created quizzes & questions for Course 1 Lesson 2');

    // 6. Create Flashcards for Course 1 (Spaced Repetition SM-2)
    await db.insert(flashcards).values([
        {
            courseId: course1Id,
            question: {
                en: 'What is Backpropagation in neural networks?',
                ar: 'ما هي عملية التمرير الخلفي للأخطاء (Backpropagation) في الشبكات العصبية؟'
            },
            answer: {
                en: 'An algorithm used to calculate the gradient of the loss function, allowing weights of the network to be adjusted to minimize error.',
                ar: 'خوارزمية تستخدم لحساب مشتقات دالة الخسارة (Loss Function)، مما يتيح ضبط أوزان وانحيازات الشبكة بالتدريج لتقليل نسبة الخطأ.'
            }
        },
        {
            courseId: course1Id,
            question: {
                en: 'Who founded Algebra and the concept of algorithms?',
                ar: 'من هو مؤسس علم الجبر ومفهوم الخوارزميات؟'
            },
            answer: {
                en: 'Al-Khwarizmi, a prominent scholar in the House of Wisdom during the Islamic Golden Age.',
                ar: 'العالم الرياضي الخوارزمي، وهو من كبار العلماء في بيت الحكمة ببغداد خلال العصر الذهبي الإسلامي.'
            }
        },
        {
            courseId: course1Id,
            question: {
                en: 'What does Ease Factor represent in the SM-2 spaced repetition algorithm?',
                ar: 'ماذا يمثل عامل السهولة (Ease Factor) في خوارزمية التكرار المتباعد SM-2؟'
            },
            answer: {
                en: 'A multiplier (starting at 2.5) that determines how fast the review interval grows. It decreases for difficult cards and increases for easy ones.',
                ar: 'معامل ضرب (يبدأ من 2.5) يحدد مدى سرعة زيادة الفترة الزمنية بين المراجعات. يتناقص للبطاقات الصعبة ويزداد للبطاقات السهلة.'
            }
        }
    ]);

    // 7. Create Flashcards for Course 2
    await db.insert(flashcards).values([
        {
            courseId: course2Id,
            question: {
                en: 'What is Zustand in React development?',
                ar: 'ما هي مكتبة Zustand في تطوير تطبيقات React؟'
            },
            answer: {
                en: 'A lightweight state management library that provides a simple API based on hooks, offering a clean alternative to Redux.',
                ar: 'مكتبة خفيفة لإدارة الحالة (State Management) توفر واجهة برمجية بسيطة مبنية على الـ hooks، وتعتبر بديلاً سهلاً ومختصراً لـ Redux.'
            }
        }
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
});
